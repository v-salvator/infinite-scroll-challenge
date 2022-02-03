import { useRef } from "react";
import { useIntersection, useUpdateEffect } from "react-use";
import { useDispatch, useSelector } from "react-redux";

import { getNextPage } from "../app/repoSlice";

const EndMarker = ({ disable }) => {
  const dispatch = useDispatch();
  const repoState = useSelector((state) => state.repo);
  const { isLoading, isLastPage } = repoState;
  const intersectionRef = useRef(null);
  const intersection = useIntersection(intersectionRef, {
    root: null,
    rootMargin: "0px",
    threshold: 1,
  });
  useUpdateEffect(() => {
    if (intersection?.intersectionRatio < 1) {
      //   console.log("!!OUSIDE!!");
      // do nothing
    } else {
      if (!isLoading && !disable && !isLastPage) {
        // console.log("!!INVIEW!!");
        dispatch(getNextPage());
      }
    }
  }, [intersection]);

  const markerString = isLoading
    ? "Loading..."
    : isLastPage
    ? "No more repos"
    : "API rate limit exceeded please wait to query";
  return (
    <div className="end-marker" ref={intersectionRef}>
      {markerString}
    </div>
  );
};

export default EndMarker;
