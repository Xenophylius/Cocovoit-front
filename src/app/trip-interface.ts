export interface TripInterface {
    id: number
    starting_point: string
    ending_point: string
    date: string
    starting_at: string
    created_at: string
    updated_at: string
    user: User
}

export interface User {
    id: number;
    firstname: string;
    lastname: string;
  }
