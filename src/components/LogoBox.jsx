import logoDark from '@/assets/images/nexus_logo_no_bg.png';
import logoLight from '@/assets/images/nexus_white_no_bg.png';
import logoSm from '@/assets/images/nexus_logo_no_bg.png';
import Image from 'next/image';
import Link from 'next/link';
const LogoBox = () => {
  return <div className="logo-box">
    <Link href="/dashboards/analytics" className="logo-dark">
      <Image width={28} height={28} src={logoSm} className="logo-sm" alt="logo sm" />
      <Image width={118} style={{ height: "50px", width: "118px" }} src={logoDark} className="logo-lg" alt="logo dark" />
    </Link>
    <Link href="/dashboards/analytics" className="logo-light">
      <Image width={28} height={28} src={logoSm} className="logo-sm" alt="logo sm" />
      <Image width={118} style={{ height: "52px", width: "118px" }} src={logoLight} className="logo-lg" alt="logo light" />
    </Link>
  </div>;
};
export default LogoBox;