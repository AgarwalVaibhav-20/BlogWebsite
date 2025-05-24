import AnimationWrapper from '@/common/page-animation';
import { X } from 'lucide-react';
import { useContext } from 'react';
import { Toaster } from 'react-hot-toast';
import { EditorContext } from './editor.pages';
const PublishForm=()=>{

    let {setEditorState} = useContext(EditorContext)

    const handleCloseEvent=()=>{
        setEditorState("editor");
    }
    return(
       <>
       <AnimationWrapper>
        <section>
            <Toaster/>
            <button className='w-12 h-12 absolute right-[5vw] z-20 top-[5%] lgLtop-[10%]' onClick={handleCloseEvent}>
                <X/>
            </button>
        </section>
       </AnimationWrapper>
       </>
    )
}

export default PublishForm