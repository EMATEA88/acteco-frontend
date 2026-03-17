import { api } from "./api"

export const KixikilaService = {

  async dashboard(){
    const res = await api.get("/kixikila/dashboard")
    return res.data
  },

  async join(groupId:string){
    const res = await api.post("/kixikila/join",{ groupId })
    return res.data
  }

}