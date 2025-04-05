// import { title } from "process"
import "./global.css"

export const metadata = {
    title: "F1GPT",
    description: "The ultimate place for all the latest f1 tea"
}

const RootLayout = ({children}) =>{
    return(
        <html lang="en">
            <body>
                {children}
            </body>
        </html>
    )
}

export default RootLayout;
