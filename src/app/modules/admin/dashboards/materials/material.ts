export interface Material {
    id?: number; // Optional property for newly created materials
    name: string;
    picture?: any; // Optional property for the base64-encoded picture
    quantity: number;
    description:string;
    desk_id: number;
  }
  