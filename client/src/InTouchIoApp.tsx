import { RouterProvider } from "react-router-dom"
import { AppRouter } from "./presentation/router/AppRouter"
import { AuthProvider } from "./presentation/providers/AuthProvider"
import { SocketProvider } from "./presentation/providers/SocketProvider"
import { MessageProvider } from "./presentation/providers/MessageProvider"
import { ChatProvider } from "./presentation/providers/ChatProvider"
import { UtilsProvider } from "./presentation/providers/UtilsProvider"

export const InTouchIoApp = () => {

    return (
        <AuthProvider>
            <SocketProvider>
                <ChatProvider>
                    <MessageProvider>
                        <UtilsProvider>
                            <RouterProvider router={AppRouter} />
                        </UtilsProvider>
                    </MessageProvider>
                </ChatProvider>
            </SocketProvider>
        </AuthProvider>
    )
}