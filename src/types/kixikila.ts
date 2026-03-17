export type KixikilaGroup = {

  id:string
  name:string

  contribution:number
  membersLimit:number

  filled:number
  cycle:number

  totalReceive:number

}

export type Participation = {

  groupId:string
  groupName:string

  position:number

  contribution:number
  totalReceive:number

  status:string

}

export type KixikilaDashboard = {

  wallet:{
    balance:number
    frozen:number
  }

  groups:KixikilaGroup[]

  participation:Participation | null

}