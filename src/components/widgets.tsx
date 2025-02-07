import { SearchIcon } from "@heroicons/react/outline";
import { AnimatePresence, motion } from "framer-motion";
import { Key, useEffect, useState } from "react";
import { useRecoilState } from "recoil";

import { News } from "@components";
import { searchKeyState } from "src/atom";

export const Widgets = ({ newsResults, randomUsersResults }: any) => {
  const [articleNum, setArticleNum] = useState(3);
  const [_searchKey, _setSearchKey] = useState("");
  const [randomUserNum, setRandomUserNum] = useState(3);
  const [searchKey, setSearchKey] = useRecoilState(searchKeyState);
  useEffect(() => {
    _setSearchKey(searchKey);
  }, [searchKey]);
  return (
    <div className="sm:w-[300px] xl:w-[450px] hidden lg:inline ml-8 space-y-5">
      <div className="w-[90%] sticky top-0 py-1.5 z-50">
        <div className="flex items-center p-3 rounded-full relative">
          <SearchIcon className="h-5 z-50 text-gray-500" />
          <input
            className="absolute inset-0 rounded-full pl-11 border-gray-500 text-gray-700 focus:shadow-lg focus:bg-white bg-gray-100"
            type="text"
            placeholder="Search Moment"
            value={_searchKey}
            onChange={(e) => _setSearchKey(e.target.value)}
            onBlur={(e) => setSearchKey(e.target.value)}
            onKeyDown={(e) => {
              //@ts-ignore
              if (e.key === "Enter") setSearchKey(e.target.value);
            }}
          />
        </div>
      </div>

      <div className="text-gray-700 space-y-3 bg-gray-100 rounded-xl pt-2 w-[90%]">
        <h4 className="font-bold text-xl px-4">Whats happening</h4>
        <AnimatePresence>
          {newsResults?.slice(0, articleNum).map((article: { title: Key | null | undefined }) => (
            <motion.div
              key={article.title}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 1 }}
            >
              <News key={article.title} article={article} />
            </motion.div>
          ))}
        </AnimatePresence>
        <button onClick={() => setArticleNum(articleNum + 3)} className="text-blue-300 pl-4 pb-3 hover:text-blue-400">
          Show more
        </button>
      </div>
      <div className="sticky top-16 text-gray-700 space-y-3 bg-gray-100 pt-2 rounded-xl w-[90%]">
        <h4 className="font-bold text-xl px-4">Who to follow</h4>
        <AnimatePresence>
          {randomUsersResults?.slice(0, randomUserNum).map((randomUser: any) => (
            <motion.div
              key={randomUser.login.username}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 1 }}
            >
              <div
                key={randomUser.login.username}
                className="flex items-center px-4 py-2  cursor-pointer hover:bg-gray-200 transition duration-500 ease-out"
              >
                <img className="rounded-full" width="40" src={randomUser.picture.thumbnail} alt="" />
                <div className="truncate ml-4 leading-5">
                  <h4 className="font-bold hover:underline text-[14px] truncate">{randomUser.login.username}</h4>
                  <h5 className="text-[13px] text-gray-500 truncate">
                    {randomUser.name.first + " " + randomUser.name.last}
                  </h5>
                </div>
                <button className="ml-auto bg-black text-white rounded-full text-sm px-3.5 py-1.5 font-bold">
                  Follow
                </button>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
        <button
          onClick={() => setRandomUserNum(randomUserNum + 3)}
          className="text-blue-300 pl-4 pb-3 hover:text-blue-400"
        >
          Show more
        </button>
      </div>
    </div>
  );
};
