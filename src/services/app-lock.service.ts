import { Capacitor } from "@capacitor/core";
import { SecureStorage } from "@aparajita/capacitor-secure-storage";

const STORAGE_KEY = "ematea.app-lock.v1";
const PBKDF2_ITERATIONS = 600_000;
const SALT_LENGTH = 16;
const HASH_LENGTH = 32;

interface StoredPinVerifier {
  version: 1;
  algorithm: "PBKDF2-SHA-256";
  iterations: number;
  salt: string;
  verifier: string;
}

class AppLockService {
  private ensureNative(): void {
    if (!Capacitor.isNativePlatform()) {
      throw new Error("O bloqueio do aplicativo EMATEA requer a versão nativa.");
    }
  }

  private validatePin(pin: string): void {
    if (!/^\d{6}$/.test(pin)) {
      throw new Error("O PIN do EMATEA deve ter exatamente 6 dígitos.");
    }
  }

  private bytesToBase64(bytes: Uint8Array): string {
    let binary = "";
    const chunkSize = 0x8000;

    for (let i = 0; i < bytes.length; i += chunkSize) {
      binary += String.fromCharCode(...bytes.subarray(i, i + chunkSize));
    }

    return btoa(binary);
  }

  private base64ToArrayBuffer(value: string): ArrayBuffer {
    const binary = atob(value);
    const buffer = new ArrayBuffer(binary.length);
    const bytes = new Uint8Array(buffer);

    for (let i = 0; i < binary.length; i += 1) {
      bytes[i] = binary.charCodeAt(i);
    }

    return buffer;
  }

  private async deriveVerifier(
    pin: string,
    salt: ArrayBuffer,
    iterations: number
  ): Promise<Uint8Array> {
    const keyMaterial = await crypto.subtle.importKey(
      "raw",
      new TextEncoder().encode(pin),
      "PBKDF2",
      false,
      ["deriveBits"]
    );

    const derivedBits = await crypto.subtle.deriveBits(
      {
        name: "PBKDF2",
        salt,
        iterations,
        hash: "SHA-256",
      },
      keyMaterial,
      HASH_LENGTH * 8
    );

    return new Uint8Array(derivedBits);
  }

  private constantTimeEqual(left: Uint8Array, right: Uint8Array): boolean {
    if (left.length !== right.length) {
      return false;
    }

    let difference = 0;

    for (let i = 0; i < left.length; i += 1) {
      difference |= left[i] ^ right[i];
    }

    return difference === 0;
  }

  async isConfigured(): Promise<boolean> {
    this.ensureNative();

    const stored = await SecureStorage.get(STORAGE_KEY);
    return stored !== null;
  }

  async configurePin(pin: string): Promise<void> {
    this.ensureNative();
    this.validatePin(pin);

    const saltBuffer = new ArrayBuffer(SALT_LENGTH);
    const salt = new Uint8Array(saltBuffer);

    crypto.getRandomValues(salt);

    const verifier = await this.deriveVerifier(
      pin,
      saltBuffer,
      PBKDF2_ITERATIONS
    );

    const data: StoredPinVerifier = {
      version: 1,
      algorithm: "PBKDF2-SHA-256",
      iterations: PBKDF2_ITERATIONS,
      salt: this.bytesToBase64(salt),
      verifier: this.bytesToBase64(verifier),
    };

    await SecureStorage.set(
      STORAGE_KEY,
      data as unknown as Record<string, unknown>
    );
  }

  async verifyPin(pin: string): Promise<boolean> {
    this.ensureNative();
    this.validatePin(pin);

    const stored = await SecureStorage.get(STORAGE_KEY);

    if (
      stored === null ||
      typeof stored !== "object" ||
      Array.isArray(stored)
    ) {
      return false;
    }

    const data = stored as unknown as StoredPinVerifier;

    if (
      data.version !== 1 ||
      data.algorithm !== "PBKDF2-SHA-256" ||
      typeof data.iterations !== "number" ||
      typeof data.salt !== "string" ||
      typeof data.verifier !== "string"
    ) {
      return false;
    }

    const salt = this.base64ToArrayBuffer(data.salt);
    const expectedVerifier = new Uint8Array(
      this.base64ToArrayBuffer(data.verifier)
    );

    const actualVerifier = await this.deriveVerifier(
      pin,
      salt,
      data.iterations
    );

    return this.constantTimeEqual(actualVerifier, expectedVerifier);
  }

  async removePin(): Promise<void> {
    this.ensureNative();
    await SecureStorage.remove(STORAGE_KEY);
  }
}

export const appLockService = new AppLockService();

export default appLockService;
