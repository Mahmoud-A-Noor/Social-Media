import MediaViewer from "../../../../components/Media/MediaViewer.jsx";

export default function StoriesCarouselItem({fileUrl}) {
    return (
        <div className="w-24 mx-1 overflow-hidden h-44 rounded-xl">
            <MediaViewer fileUrl={fileUrl} />
        </div>
    )
}