import Modal from "../../../../../../components/Modal/Modal.jsx";
import {Care, Love, Sad} from "../../../../../../constants/facebook-reactions.jsx";
import Comments from "./Comments.jsx";
import CommentInput from "./CommentInput.jsx";
import {useRef, useState} from "react";

export default function CommentModal({isModalOpen, setIsModalOpen, postId}) {

    const [comments, setComments] = useState([]);

    return (
        <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} header={"my awesome page's post"} width="41rem">
            <div className="w-full pt-2 pb-1 mt-5 mb-3 bg-white rounded-lg shadow-md post xs:max-sm:px-4">
                <div id="post-top-part" className="flex items-center justify-between px-3">
                    <div className="flex">
                        <div className="size-12">
                            <img className="w-full h-full rounded-full " src="/src/assets/person.png" alt=""/>
                        </div>
                        <div className="ms-2">
                            <h5 className="text-base font-medium text-black">my awesome page</h5>
                            <h6 className="text-sm font-medium text-gray-500">13m</h6>
                        </div>
                    </div>
                </div>
                <div id="post-middle-part" className="mt-3">
                    <h5 className="px-3 mb-3">عاجل | القناة 14 الإسرائيلية: الجيش قد يفجر قريبا المنزل الذي قتل فيه
                        السنوار</h5>
                    <img className="w-full h-auto" src="/src/assets/post.jpg"/>
                    <div className="flex items-center justify-between px-3 py-2">
                        <div id="post-emojis" className="flex items-center">
                            <div className="z-30 rounded-full ring-1 ring-white size-5">
                                <Sad/>
                            </div>
                            <div className="z-20 -ms-[0.05rem] ring-1 ring-white rounded-full size-5">
                                <Care/>
                            </div>
                            <div className="z-10 -ms-[0.05rem] ring-1 ring-white rounded-full size-5">
                                <Love/>
                            </div>
                            <span className="text-sm font-semibold text-gray-500 ms-1">5.2k</span>
                        </div>
                        <div id="post-analysis">
                            <span className="text-sm font-semibold text-gray-500">347 comment</span>
                            <span className="text-sm font-semibold text-gray-500 ms-4">123 shares</span>
                        </div>
                    </div>
                </div>
                <div className="px-3">
                    <div className="border-t border-t-gray-300"></div>
                </div>
            </div>
            <Comments postId={postId} comments={comments} setComments={setComments} />
            <CommentInput postId={postId} setComments={setComments} />
        </Modal>
)
}