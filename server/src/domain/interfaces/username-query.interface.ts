export interface UsernameQuery {
    $or?: Array<{ [key: string]: { $regex: string; $options: string } }>;
}