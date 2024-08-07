export interface TripInterface {
    id: number
    starting_point: string
    ending_point: string
    date: string
    starting_at: string
    created_at: string
    updated_at: string
    user_id: string
    participate: number[]
    price: number
    available_places: number
    user: User
}

export interface User {
    id: string;
    firstname: string;
    lastname: string;
  }
