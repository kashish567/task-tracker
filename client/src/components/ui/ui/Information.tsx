import React from "react";
import infoImage from "../../../../public/login.png"; // Replace with your actual image path

const Information = () => {
  return (
    <section className="bg-gray-900 text-white py-12">
      <div className="container mx-auto px-4 grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
        <div>
          <h2 className="text-3xl font-semibold mb-4 text-yellow-500">Why Choose Task Tracker?</h2>
          <p className="text-lg mb-8">
            Task Tracker is designed to simplify task management and enhance productivity. With its intuitive features and user-friendly interface, managing your tasks becomes effortless.
          </p>
          <p className="text-lg">
            Whether you're an individual or a team, Task Tracker adapts to your needs, helping you stay organized and focused on what matters most.
          </p>
        </div>
        <div className="text-center">
          <img
            src={infoImage}
            alt="Additional Info Image"
            className="mx-auto"
            width={430} // Adjust as necessary
            height={350} // Adjust as necessary
          />
        </div>
      </div>
    </section>
  );
};

export default Information;
