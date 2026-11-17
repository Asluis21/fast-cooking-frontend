import { api } from "../api/client"

export interface DishResponse {
    id:number,
    name:string,
    description:string,
}

export const dishService = {

    getAll:() => api<DishResponse>("/dish"),

};