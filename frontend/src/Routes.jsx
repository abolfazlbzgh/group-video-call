import Home from "./pages/Home"
import Join from "./pages/Join"
import VideoCall from "./pages/VideoCall"
const routes = [

    { path: "/", element: <Home /> },
    { path: "/join/:roomId", element: <Join /> },
    { path: "/video-call/:roomId", element: <VideoCall /> },
]

export default routes;