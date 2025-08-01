import Image from 'next/image';
import Link from 'next/link';
import { APP_NAME } from '@/lib/constants';
import Menu from './menu';
import CategoryDrawer from './category-drawer';
import Search from './search';

const Header = () => {
    return <header className='w-full border-b'>
        <div className="wrapper flex-between">
            <div className="flex-start">
                <CategoryDrawer />
                <Link href="/" className="flex-start ml-4">
                    <Image
                        src="/images/logo.png"
                        alt={`${APP_NAME} Logo`}
                        width={48}
                        height={48}
                        priority={true}
                    />
                    {/* <span className="hidden lg:block text-2xl font-bold ml-3">{APP_NAME}</span> */}
                </Link>
            </div>

            <div className='hidden md:block'>
                <Search />
            </div>
            
            <Menu />

        </div>
    </header>;
};

export default Header;
