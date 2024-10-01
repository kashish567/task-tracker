
import { FiStar } from "react-icons/fi";
import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
  } from "@/components/ui/carousel"
  import { Card, CardContent } from "@/components/ui/card";

const UserTestimonials = () => {
  const testimonials = [
    {
      name: "Siena Gomes",
      feedback:
        "Task Tracker has revolutionized the way I manage my tasks. It's incredibly intuitive and keeps me on top of my schedule!",
      rating: 5,
    },
    {
      name: "Roy Patel",
      feedback:
        "I love the simplicity and efficiency of Task Tracker. It's helped me stay organized and productive every day.",
      rating: 4,
    },
    {
      name: "Michael Lopez",
      feedback:
        "The task status tracking feature is fantastic! It ensures that I never miss a deadline. Task Tracker has been a very useful tool to me!",
      rating: 5,
    },
    {
      name: "Aanya Malhotra",
      feedback:
        "Early task completion by constant tracking of the tasks, have significantly improved my efficiency. Highly recommend Task Tracker!",
      rating: 4,
    },
    {
      name: "Trish Shah",
      feedback:
        "Task Tracker is an essential tool for anyone looking to stay organized. It's user-friendly and packed with useful features.",
      rating: 5,
    },
  ];

  return (
    <section className="bg-gray-900 text-white py-5">
      <div className="container mx-auto px-4 mb-16">
        <h2 className="text-2xl font-semibold mb-6">
          What Our Users Say
        </h2>
        <Carousel
          opts={{
            align: "start",
          }}
          className="w-full"
        >
          <CarouselContent>
            {testimonials.map((testimonial, index) => (
              <CarouselItem key={index} className="md:basis-1/2 lg:basis-1/3">
                <div className="p-1">
                  <Card>
                    <CardContent className="flex flex-col items-center justify-center p-8">
                      <div className="mb-3 flex">
                        {Array.from({ length: testimonial.rating }).map((_, i) => (
                          <FiStar key={i} className="text-yellow-500 w-6 h-6 inline-block" />
                        ))}
                      </div>
                      <h3 className="text-xl font-bold mb-2">{testimonial.name}</h3>
                      <p className="text-black text-center font-medium">{testimonial.feedback}</p>
                    </CardContent>
                  </Card>
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious />
          <CarouselNext />
        </Carousel>
      </div>
    </section>
  );
};

export default UserTestimonials;