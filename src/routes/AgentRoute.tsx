import { Navigate } from "react-router-dom"
import type { ReactNode } from "react"

import { useAuth } from "../contexts/AuthContext"

interface Props {
    children: ReactNode
}

export default function AgentRoute({
    children
}: Props) {

    const {
        loading,
        isAuthenticated,
        user
    } = useAuth()

    if (loading) {
        return null
    }

    if (!isAuthenticated || !user) {
        return (
            <Navigate
                to="/login"
                replace
            />
        )
    }

    if (user.role !== "AGENT") {
        return (
            <Navigate
                to="/home"
                replace
            />
        )
    }

    return <>{children}</>
}