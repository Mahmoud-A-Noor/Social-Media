import Navbar from "../../components/Navbar/page"
import usePageSwitcher from "../../hooks/usePageSwitcher"

export default function Home() {

    const {getPageContent, switchPage} = usePageSwitcher()
    const pageContent = getPageContent()
    return (
        <>
            <Navbar switchPage={switchPage} />
            {pageContent}
        </>
    )
}