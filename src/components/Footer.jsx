import React from "react";

export default function Footer() {
  // const socialIcons = [
  //   {
  //     href: "#",
  //     svg: (
  //       <svg
  //         xmlns="http://www.w3.org/2000/svg"
  //         classNameName="h-4 w-4"
  //         fill="currentColor"
  //         viewBox="0 0 24 24">
  //         <path
  //           d="M9 8h-3v4h3v12h5v-12h3.642l.358-4h-4v-1.667c0-.955.192-1.333 1.115-1.333h2.885v-5h-3.808c-3.596 0-5.192 1.583-5.192 4.615v3.385z" />
  //       </svg>
  //     ),
  //   },
  //   {
  //     href: "#",
  //     svg: (
  //       <svg
  //         xmlns="http://www.w3.org/2000/svg"
  //         classNameName="h-4 w-4"
  //         fill="currentColor"
  //         viewBox="0 0 24 24">
  //         <path
  //           d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z" />
  //       </svg>
  //     ),
  //   },
  //   {
  //     href: "#",
  //     svg: (
  //       <svg
  //         xmlns="http://www.w3.org/2000/svg"
  //         classNameName="h-5 w-5"
  //         fill="currentColor"
  //         viewBox="0 0 24 24">
  //         <path
  //           d="M7 11v2.4h3.97c-.16 1.029-1.2 3.02-3.97 3.02-2.39 0-4.34-1.979-4.34-4.42 0-2.44 1.95-4.42 4.34-4.42 1.36 0 2.27.58 2.79 1.08l1.9-1.83c-1.22-1.14-2.8-1.83-4.69-1.83-3.87 0-7 3.13-7 7s3.13 7 7 7c4.04 0 6.721-2.84 6.721-6.84 0-.46-.051-.81-.111-1.16h-6.61z" />
  //       </svg>
  //     ),
  //   },
  //   // باقي الأيقونات هنا...
  // ];

  return (
    <footer className="mx-auto w-full  shadow-2xl shadow-black bg-themeColor-400  max-w-container px-4 sm:px-6 lg:px-8 mt-10">
      <div className="py-8 flex items-center justify-center text-sm font-semibold leading-6 text-white">
        <a href="cowdly.com">
          <img className=" rounded-lg w-fit h-8" src="/cowdly.png" alt="" />
        </a>
        <p className="text-center text-sm text-white">
          Copyright © 2024
          <a href="cowdly.com" className="hover:underline ">
            <span className="font-semibold text-white"> Cowdly Team</span>
          </a>
        </p>
        {/* <a href="/privacy-policy">Privacy policy</a> */}
      </div>
    </footer>
  );
}
