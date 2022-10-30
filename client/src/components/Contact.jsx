import React, { useState, useEffect } from "react";
import { MdEmail } from "react-icons/md";
import { FaAddressCard } from "react-icons/fa";

const Contact = () => {
  let [userData, setUserData] = useState({
    // Added this initial object for the sake of the controlled component error
    name: "",
    email: "",
    phone: "",
    work: "",
    password: "",
    cpassword: "",
    message: "",
  });

  const onChangeHandler = (e) => {
    let value = e.target.value;
    let name = e.target.id;
    setUserData({ ...userData, [name]: value });
  };

  const getData = async () => {
    try {
      const res = await fetch("/about");
      const data = await res.json();

      // setUserData({...userData,name: data.name, work:data.work,email:data.email,phone:data.phone})
      setUserData(data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getData();
  }, []);

  // Sending data to the database
  const postData = async (e) => {
    e.preventDefault();
    const { name, email, phone, work, password, cpassword, message } = userData;
    const res = await fetch("/contact", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name,
        email,
        phone,
        work,
        password,
        cpassword,
        message,
      }),
    });

    const data = await res.json();
    alert(data.message);
    setUserData({...userData,message:""})

    // if (data.regStatus === 201) {
    //   navigate("/signin");
    // }
  };

  return (
    <>
      <div className="container mx-auto my-auto justify-between flex w-10/12 p-2 mt-4">
        {/* This is for the contact details */}
        <div className="contactDetail flex justify-between w-full space-x-6 smm:flex-col smm:space-x-0">
          <div className="pPhone flex items-center p-4 px-3 shadow-lg w-1/3 smm:w-full smtmd:p-2 smtmd:px-1">
            <div className="font-bold ml-2 smtmd:ml-2">📞</div>
            <div className="px-7 w-full smtmd:px-4">
              <h1 className="text-lg font-bold ">Phone</h1>
              <h1 className="text-sm">123456789</h1>
            </div>
          </div>
          <div className="pEmail flex items-center p-4 px-3 shadow-lg w-1/3 smm:w-full smtmd:p-2 smtmd:px-1">
            <div className="font-bold ml-3 smtmd:ml-2">
              <MdEmail />
            </div>
            <div className="px-7 w-full smtmd:px-4">
              <h1 className="text-lg font-bold">Email</h1>
              <h1 className="text-sm">abc@gmail.com</h1>
            </div>
          </div>
          <div className="pAddress flex items-center p-4 px-3 shadow-lg w-1/3 smm:w-full smtmd:p-2 smtmd:px-1">
            <div className="font-bold ml-3 smtmd:ml-2">
              <FaAddressCard />
            </div>
            <div className="px-7 w-full smtmd:px-4">
              <h1 className="text-lg font-bold">Address</h1>
              <h1 className="text-sm">City, State, Country</h1>
            </div>
          </div>
        </div>
      </div>

      {/* This is for the message taken from the user */}
      <div className="getMessage container w-1/2 flex flex-col mx-auto p-8 mt-12 space-y-3 shadow-2xl lgm:w-full  smm:shadow-none">
        <div className="p-3 mdm:items-center mdm:justify-center">
          <h1 className="text-3xl font-extrabold mdm:w-fit mdm:mx-auto">
            Get in Touch
          </h1>
        </div>
        <form action="" method="post">
          <div className="flex justify-between w-full space-x-6 p-2 px-4 mdm:flex-col mdm:space-x-0 mdm:space-y-4">
            <input
              type="text"
              id="name"
              placeholder="Your Name"
              className="placeholder:text-lg w-1/3 border border-gray-300 rounded-md p-3 focus:outline-none mdm:w-full"
              value={userData.name}
              onChange={onChangeHandler}
            />
            <input
              type="email"
              id="email"
              placeholder="Your Email"
              className="placeholder:text-lg w-1/3 border border-gray-300 rounded-md p-3 focus:outline-none mdm:w-full"
              value={userData.email}
              onChange={onChangeHandler}
            />
            <input
              type="tel"
              id="phone"
              placeholder="Phone Number"
              className="placeholder:text-lg w-1/3 border border-gray-300 rounded-md p-3 focus:outline-none mdm:w-full"
              value={userData.phone}
              onChange={onChangeHandler}
            />
          </div>
          <div className="p-4">
            <textarea
              name="message"
              id="message"
              rows="5"
              placeholder="Message"
              className="w-full p-4 placeholder:text-lg border border-gray-300 rounded-md focus:outline-none"
              onChange={onChangeHandler}
              value={userData.message}
            ></textarea>
          </div>

          <div className="p-2 px-4 flex">
            <button
              className="bg-green-500 rounded-md h-12 text-xl text-white hover:bg-green-600 font-bold drop-shadow-lg hover:drop-shadow-2xl w-1/3 mdm:p-2 mdm:mx-auto lgm:mx-auto mdm:w-2/3"
              onClick={postData}
            >
              Send Message
            </button>
          </div>
        </form>
      </div>
    </>
  );
};

export default Contact;
