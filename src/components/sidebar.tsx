import { HomeIcon, UserIcon } from "@heroicons/react/outline";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

import { Avatar, SidebarMenuItem } from "@components";
import { useSpaceDomain, useSpaceFNSContract, useWalletProvider } from "@hooks";
import { sortAddress } from "@utils/helpers";

export const Sidebar = () => {
  const router = useRouter();
  const { connect, disconnect, address } = useWalletProvider();
  const { mainDomain } = useSpaceDomain();
  const { getAvatar } = useSpaceFNSContract();
  const [userImg, setUserImg] = useState<string | undefined>(undefined);
  useEffect(() => {
    (async () => {
      if (!address) return;
      const _avatarUrl = await getAvatar(address);
      setUserImg(_avatarUrl);
    })();
  }, []);
  return (
    <div className="flex justify-end xl:w-1/3 sm:min-w-[80px]">
      <div className="hidden sm:flex flex-col p-2 xl:items-start h-screen ml-auto mr-0 xl:mr-4 fixed">
        {/* Logo */}

        <button className="flex p-1.5 mx-auto xl:mx-0" onClick={() => router.push("/")}>
          <img className="w-[30px] h-[30px]" src="/logo.png" alt="Logo" />
          <p className="hidden xl:flex text-2xl font-bold font-mono mx-3">MomentSwap</p>
        </button>

        {/* Menu */}

        <div className="mt-4 mb-2.5 xl:items-start">
          <SidebarMenuItem text="Home" Icon={HomeIcon} active link={"/"} />
          {/* <SidebarMenuItem text="Explore" Icon={HashtagIcon} link={""} /> */}

          {address && (
            <>
              {/* <SidebarMenuItem text="Notifications" Icon={BellIcon} link={""} />
            <SidebarMenuItem text="Messages" Icon={InboxIcon} link={""} />
            <SidebarMenuItem text="Bookmarks" Icon={BookmarkIcon} link={""} />
            <SidebarMenuItem text="Lists" Icon={ClipboardIcon} link={""} /> */}
              <SidebarMenuItem text="Profile" Icon={UserIcon} link={`/user?address=${address}`} />
              {/* <SidebarMenuItem
              text="More"
              Icon={DotsCircleHorizontalIcon}
              link={""}
            /> */}
            </>
          )}
        </div>

        {address ? (
          <>
            <label
              htmlFor="publish-modal"
              className="flex text-center bg-primary rounded-full w-12 xl:w-56 h-12 font-bold shadow-md hover:bg-primary-focus text-lg mx-auto"
            >
              <p className="hidden xl:inline m-auto">Publish</p>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-6 h-6 xl:hidden m-auto"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10"
                />
              </svg>
            </label>

            {/* Mini-Profile */}
            <div
              className="mt-auto mb-10 mx-auto rounded-full ring-2 ring-secondary ring-offset-base-100 ring-offset-2 cursor-pointer select-none flex xl:py-2 xl:px-4 xl:hover:bg-secondary hover:ring-secondary-focus"
              onClick={() => {
                router.push("/");
                disconnect();
              }}
            >
              <Avatar seed={address} image={userImg} diameter={38} className="items-center" />
              <div className="leading-5 hidden xl:inline xl:ml-2 xl:w-[120px]">
                <h4 className="font-bold text-sm truncate">{mainDomain || "---"}.fil</h4>
                <p className="font-light text-sm">{sortAddress(address)}</p>
              </div>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="h-5 xl:ml-2 hidden my-auto xl:inline"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15m3 0l3-3m0 0l-3-3m3 3H9"
                />
              </svg>
            </div>
          </>
        ) : (
          <label
            //TODO: Open comments after FNS development is completed
            // htmlFor={mainDomain || "identity-modal"}
            onClick={connect}
            className="flex cursor-pointer bg-accent text-accent-content rounded-full w-12 xl:w-56 h-12 font-bold shadow-md hover:brightness-95 text-lg"
          >
            <div className="m-auto">
              <p className="hidden xl:inline">Sign in</p>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-6 h-6 xl:hidden mx-auto"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15M12 9l-3 3m0 0l3 3m-3-3h12.75"
                />
              </svg>
            </div>
          </label>
        )}
      </div>
    </div>
  );
};
