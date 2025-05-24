import multer from 'multer';

const storage = multer.diskStorage({
    destination:function (req , file , cd){
        cd(null , '"./publix/temp')
    },
    filename:function (req , file , cd){
        const uniqueSuffix = Date.now() +'-' + Math.round(Math.random() * 1E9)
        cd(null , file.filename + '-' + uniqueSuffix)
    }
})
const upload = multer({storage:storage})   