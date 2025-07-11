import { getLatestProduct } from "@/lib/actions/product.actions";
import ProductList from "@/components/shared/product/product-list";
import { Product } from "@/types"; 

const Homepage = async () => {
  const rawProducts = await getLatestProduct();

  const latestproduct: Product[] = rawProducts.map((p) => ({
    ...p,
    price: p.price.toString(),   
    rating: p.rating.toString(), 
  }));
 
  return (
    <ProductList
      data={latestproduct}
      title="Featured Products"
      limit={4}
    /> 
  );
};

export default Homepage;
