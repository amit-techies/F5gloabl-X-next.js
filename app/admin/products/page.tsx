import { promises } from "dns";

const AdminProductPage = async (props:{
   searchParams:Promise<{
      page:string;
      query:string;
      category:string;
   }>
})=>{
   const searchParams = await props.searchParams;
   const page = Number(searchParams.page) || 1;
   const searchQuery = searchParams.query || '';
   const category = searchParams.category || '';

   return<div className="space-y-2">
           <div className="felx-between">
            <h1 className="h2-bol">Products</h1>
           </div> 
        </div>
}

export default AdminProductPage;