"use client"

import avatar1 from '@/assets/images/users/avatar-1.jpg';
import IconifyIcon from '@/components/wrappers/IconifyIcon';
import { useNotificationContext } from '@/context/useNotificationContext';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Dropdown, DropdownHeader, DropdownItem, DropdownMenu, DropdownToggle } from 'react-bootstrap';
const ProfileDropdown = () => {

  const router = useRouter();
  const { showNotification } = useNotificationContext();

  const handleLogout = () => {
    // Clear cookies
    try {
      const { destroyCookie } = require('nookies');
      ['accessToken', 'refreshToken', 'userName', 'role', 'userStatus'].forEach((name) => {
        destroyCookie(null, name, { path: '/' });
      });
    } catch { }

    showNotification({
      message: "Logged out",
      description: "You have been successfully logged out.",
      variant: "danger"
    });

    // Redirect to login
    router.push("/auth/sign-in");
  };

  return <Dropdown className="topbar-item" drop="down">
    <DropdownToggle as={'a'} type="button" className="topbar-button content-none" id="page-header-user-dropdown " data-bs-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
      <span className="d-flex align-items-center">
        <Image className="rounded-circle" width={32} src={avatar1} alt="avatar-3" />
      </span>
    </DropdownToggle>
    <DropdownMenu className="dropdown-menu-end">
      <DropdownHeader as={'h6'} className="dropdown-header">
        Welcome Admin!
      </DropdownHeader>
      {/* <DropdownItem as={Link} href="/profile">
        <IconifyIcon icon="solar:calendar-broken" className="align-middle me-2 fs-18" />
        <span className="align-middle">My Schedules</span>
      </DropdownItem>
      <DropdownItem as={Link} href="/pages/pricing">
        <IconifyIcon icon="solar:wallet-broken" className="align-middle me-2 fs-18" />
        <span className="align-middle">Pricing</span>
      </DropdownItem> */}
      <DropdownItem as={Link} href="/support/faqs">
        <IconifyIcon icon="solar:help-broken" className="align-middle me-2 fs-18" />
        <span className="align-middle">Help</span>
      </DropdownItem>
      <DropdownItem as={Link} href="/auth/lock-screen">
        <IconifyIcon icon="solar:lock-keyhole-broken" className="align-middle me-2 fs-18" />
        <span className="align-middle">Lock screen</span>
      </DropdownItem>
      <div className="dropdown-divider my-1" />
      <DropdownItem as={Link} onClick={handleLogout} className=" text-danger" href="/auth/sign-in">
        <IconifyIcon icon="solar:logout-3-broken" className="align-middle me-2 fs-18" />
        <span className="align-middle">Logout</span>
      </DropdownItem>
    </DropdownMenu>
  </Dropdown>;
};
export default ProfileDropdown;