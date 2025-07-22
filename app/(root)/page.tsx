import { getLatestProducts, getFeaturedProducts } from "@/lib/actions/product.actions";
import ProductList from "@/components/shared/product/product-list";
import { Product } from "@/types";
import ProductCarousel from "@/components/shared/product/product-carousel";
import ViewAllProducts from "@/components/view-all-products-button";
import IconBoxes from "@/components/icon-boxes";
import DealCountdown from "@/components/deal-countdown";

const Homepage = async () => {
  const rawProducts = await getLatestProducts();
  const featuredProducts = await getFeaturedProducts();

  const latestproduct: Product[] = rawProducts.map((p) => ({
    ...p,
    price: p.price.toString(),
    rating: p.rating.toString(),
  }));


  return (
    <>

      {featuredProducts.length > 0 && (
        <ProductCarousel data={featuredProducts} />
      )}

      <ProductList
        data={latestproduct}
        title="Featured Products"
        limit={10}
      />
      
      <ViewAllProducts/>
      <IconBoxes/>
      <DealCountdown/>
    </>
  );
};

export default Homepage;
