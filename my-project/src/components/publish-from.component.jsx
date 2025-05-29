import AnimationWrapper from '@/common/page-animation';
import { X } from 'lucide-react';
import { useContext } from 'react';
import { Toaster } from 'react-hot-toast';
import { EditorContext } from './editor.pages';

const PublishForm=()=>{

    let {blog :{banner , title , tags , des} ,setEditorState} = useContext(EditorContext)

    const handleCloseEvent=()=>{
        setEditorState("editor");
    }
    return(
       <>
       <AnimationWrapper>
        <section className='w-screen min-h-screen grid items-center lg:grid-cols-2'>
            <Toaster/>
            <button className='w-12 h-12 absolute right-[5vw] z-20 top-[5%] lg:top-[10%]' onClick={handleCloseEvent}>
                <X/>
            </button>
            <div>
                <p className='text-gray-900'>preview</p>
                <div>
                     <img src={banner} alt="image
                     " />
                </div>
               <h1 className='text-4xl font-medium mt-2  leading-tight line-clamp-1'>{title}</h1>
               <p className='font-light line-clamp-1 text-xl leading-7 mt-4'>{des}</p>
            </div>
            <div className='border-gray-100 lg:border-1 '>
                <p>Blog Title</p>
                <input type="text" placeholder='Blog title' defaultValue={title}/>
            </div>
        </section>
       </AnimationWrapper>
       </>
    )
}

export default PublishForm