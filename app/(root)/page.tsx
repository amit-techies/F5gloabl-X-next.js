import ProductList from "@/components/shared/product/product-list";
import { getLatestProduct } from "@/lib/actions/product.actions";

const Homepage = async () => {

  const latestproduct = await getLatestProduct();
  return <ProductList data={latestproduct} title="Featured Products" 
  limit={4}
  />;
}

export default Homepage;