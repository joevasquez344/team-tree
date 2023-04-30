import React from "react";
import Skeleton from "react-loading-skeleton";

const skeletons = [1, 2, 3, 4, 5, 6];

const ChatSkeleton = () => {
  return (
    <div className="px-7 pt-3">
      {skeletons.map((item) => (
        <div key={item} className="flex space-x-3 mb-7">
          <div className="w-10 h-10 rounded-full">
            <Skeleton
              className="w-full h-full rounded-full"
              baseColor="rgb(31 41 55)"
              count={1}
              width="100%"
              height="100%"
              borderRadius="500px"
              highlightColor="rgb(55 65 81)"
              enableAnimation={true}
              direction="rtl"
              duration={1}
            />
          </div>
          <div className="w-1/2">
            <Skeleton
              className="mb-3"
              baseColor="rgb(31 41 55)"
              count={1}
              width="100px"
              height="20px"
              highlightColor="rgb(55 65 81)"
              enableAnimation={true}
              direction="rtl"
              duration={1}
            />

            <Skeleton
              baseColor="rgb(31 41 55)"
              count={1}
              height="150px"
              highlightColor="rgb(55 65 81)"
              enableAnimation={true}
              direction="rtl"
              duration={1}
            />
          </div>
        </div>
      ))}
    </div>
  );
};

export default ChatSkeleton;