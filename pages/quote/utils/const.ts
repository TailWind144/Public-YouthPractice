export const layouts = [
  // 纵向
  {
    wrapperClass:
      "p-8 flex justify-center items-center md:items-start md:justify-end h-full w-full bg-black/40 backdrop-blur",
    innerWrapperClass: "flex flex-col justify-center items-center gap-6",
    imgClass: "w-full md:w-[55vw] lg:w-[50vw] outline-8 outline outline-white",
    quoteClass: "inner text-white w-full md:w-[55vw] lg:w-[50vw]",
  },
  // 横向
  {
    wrapperClass:
      "px-8 flex justify-center items-center h-full w-full bg-black/40 backdrop-blur",
    innerWrapperClass:
      "flex flex-col md:flex-row justify-center items-center gap-6",
    imgClass: "w-full md:w-[50vw] outline-8 outline outline-white",
    quoteClass: "inner text-white w-full md:w-[50vw] mt-auto",
  },
]
