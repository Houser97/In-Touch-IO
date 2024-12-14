import { useContext, useState } from "react"
import { User } from "../../domain/entities/user.entity";
import { userRepositoryProvider } from "../providers/repositories/user-repository.provider";
import { AuthContext } from "../providers/AuthProvider";

export const useUsers = () => {
    const [users, setUsers] = useState<User[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    const { setAuth } = useContext(AuthContext);


    const getByNameOrEmail = async (value: string) => {
        setIsLoading(true);
        try {
            const users = await userRepositoryProvider.getByNameOrEmail(value);
            setUsers(users);
        } catch (error) {
            // TODO: Agregar mensaje
        } finally {
            setIsLoading(false);
        }

    }

    const updateUser = async (id: string, name: string, pictureUrl: string, newPictureId: string, oldPictureId: string) => {
        try {
            const user = await userRepositoryProvider.update(id, name, pictureUrl, newPictureId, oldPictureId);
            setAuth(prev => ({ ...prev, user }))
        } catch (error) {
            console.error(error);
        }
    }

    return {
        users,
        isLoading,

        getByNameOrEmail,
        updateUser
    }
}