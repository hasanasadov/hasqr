"use client";

import { useForm, Controller } from "react-hook-form";
import React, { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { z } from "zod";

const projectTypes = [
  "Multipage Website Design (Full Stack)",
  "API Development (Integration)",
  "Frontend Development",
  "Backend Development",
];

const budgetRanges = ["$1k - $3k", "$3k - $5k", "$5k - $10k", "> $10k"];

const contactFormSchema = z.object({
  fullName: z.string().min(2, "Full name is required"),
  email: z.string().email("Invalid email address"),
  message: z.string().min(10, "Message must be at least 10 characters"),
  selectedProjects: z.array(z.string()).min(1, "Select at least one project"),
  selectedBudget: z.string().min(1, "Select a budget"),
});

type ContactFormData = z.infer<typeof contactFormSchema>;

const ContactForm = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    control,
    reset,
  } = useForm<ContactFormData>({
    resolver: zodResolver(contactFormSchema),
    defaultValues: {
      fullName: "",
      email: "",
      message: "",
      selectedProjects: [],
      selectedBudget: "",
    },
  });

  const [loading, setLoading] = useState(false);
  const onSubmit = async (data: ContactFormData) => {
    setLoading(true);
    const res = await fetch("/api/contact", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    setLoading(false);

    const response = await res.json();
    if (response.success) {
      toast.success("Email sent successfully!");
      toast.info("I will get back to you as soon as possible.");
    } else {
      toast.error("Failed to send email. Please try again later.");
      console.error("Error details:", response.error);
    }
    reset();
  };

  return (
    <div className="w-full shadow-inner dark:shadow-gray-800 shadow-gray-400 rounded-3xl dark:bg-white/5 bg-black/5 lg:p-10 md:p-8 p-6 ">
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-10">
        <div className="flex flex-col gap-2">
          <label className="text-lg font-medium">Full Name</label>
          <Input
            {...register("fullName")}
            className="!p-6 bg-white/5 rounded-xl dark:border-white/10 border-black/10"
            placeholder="Your name"
          />
          {errors.fullName && (
            <span className="text-yellow-600 text-sm">
              {errors.fullName.message}
            </span>
          )}
        </div>

        <div className="flex flex-col gap-2">
          <label className="text-lg font-medium">Email</label>
          <Input
            {...register("email")}
            className="!p-6 bg-white/5 rounded-xl dark:border-white/10 border-black/10"
            placeholder="Your email"
          />
          {errors.email && (
            <span className="text-yellow-600 text-sm">
              {errors.email.message}
            </span>
          )}
        </div>

        <div className="flex flex-col lg:flex-row gap-10">
          <div className="flex-1">
            <p className="mb-4 text-lg">What’s Your Project About?</p>
            <Controller
              name="selectedProjects"
              control={control}
              render={({ field }) => (
                <div className="flex flex-col gap-4">
                  {projectTypes.map((item) => {
                    const isChecked = field.value.includes(item);
                    return (
                      <label
                        key={item}
                        className="flex items-center gap-3 cursor-pointer"
                      >
                        <div
                          className={`w-5 h-5 rounded-md border ${
                            isChecked
                              ? "dark:bg-white bg-black dark:border-white !border-black"
                              : "border-white/30 dark:bg-black bg-black/10"
                          } transition`}
                          onClick={() =>
                            isChecked
                              ? field.onChange(
                                  field.value.filter((v) => v !== item)
                                )
                              : field.onChange([...field.value, item])
                          }
                        />
                        <span>{item}</span>
                      </label>
                    );
                  })}
                  {errors.selectedProjects && (
                    <span className="text-yellow-600 text-sm">
                      {errors.selectedProjects.message}
                    </span>
                  )}
                </div>
              )}
            />
          </div>

          <div className="flex-1">
            <p className="mb-4 text-lg">Project Budget</p>
            <Controller
              name="selectedBudget"
              control={control}
              render={({ field }) => (
                <div className="flex flex-col gap-4">
                  {budgetRanges.map((budget) => (
                    <label
                      key={budget}
                      className="flex items-center gap-3 cursor-pointer"
                    >
                      <div
                        className={`w-5 h-5 rounded-full border ${
                          field.value === budget
                            ? "dark:bg-white bg-black dark:border-white !border-black"
                            : "border-white/30 dark:bg-black bg-black/10"
                        } transition`}
                        onClick={() => field.onChange(budget)}
                      />
                      <span>{budget}</span>
                    </label>
                  ))}
                  {errors.selectedBudget && (
                    <span className="text-yellow-600 text-sm">
                      {errors.selectedBudget.message}
                    </span>
                  )}
                </div>
              )}
            />
          </div>
        </div>

        <div className="flex flex-col gap-6">
          <div className="flex-1">
            <p className="text-lg">Share More Details</p>
          </div>
          <div>
            <Textarea
              {...register("message")}
              className="!p-6 bg-white/5 mb-3 rounded-xl dark:border-white/10 border-black/10 min-h-[200px]"
              placeholder="About your project"
            />
            {errors.message && (
              <span className="text-yellow-600 text-sm ">
                {errors.message.message}
              </span>
            )}
          </div>
        </div>

        <div>
          <Button
            type="submit"
            variant="outline"
            disabled={loading}
            className={`!py-6 !px-10 text-lg bg-black/5 rounded-xl dark:border-white/10 border-black/10 ${
              loading ? "cursor-not-allowed" : ""
            } `}
          >
            {loading ? "Sending..." : "Submit"}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default ContactForm;
