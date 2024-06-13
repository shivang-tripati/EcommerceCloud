

import prismadb from "@/lib/prismadb";
import { CategoryForm} from "./components/category-form";

const CategoryPage = async ({
    params
} : {
    params: {categoryId : string, storeId : string}
}) => {


    

    const cateogry = await prismadb.category.findUnique({
        where: {
            id: params.categoryId
        },
        include : {
            billboard : true
        }
    })

    const billboard =  await prismadb.billboard.findMany({
        where : {
            storeId :  params.storeId
        }
    })

    return (    
        <div className="flex-col">
            <div className="flex-1 space-y-4 p-8">
                <CategoryForm billboards={billboard} initialData={cateogry}/>
            </div>
        </div>
    )
}

export default CategoryPage