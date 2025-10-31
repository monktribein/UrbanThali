import React, { useState } from "react";
import Swal from "sweetalert2";
import { Delete } from "@/svg";
import DeleteTooltip from "../../tooltip/delete-tooltip";
import { useDeleteReviewsMutation } from "@/redux/review/reviewApi";

const DeleteReviews = ({ id }: { id: string }) => {
  const [showDelete, setShowDelete] = useState<boolean>(false);
  const [deleteReviews, { data, isError, isLoading }] =
    useDeleteReviewsMutation();

  // handleDelete
  const handleDelete = (productId: string) => {
    if (productId) {
      Swal.fire({
        title: "Are you sure?",
        text: `All reviews deleted for the product?`,
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes, delete it!",
      }).then(async (result) => {
        if (result.isConfirmed) {
          // try {
          //   const res = await deleteReviews(id);
          //   if('data' in res){
          //     if('message' in res.data){
          //       Swal.fire("Deleted!", `${res.data.message}`, "success");
          //     }
          //   }
          //   else {
          //     Swal.fire("Deleted!", `Product reviews not found`, "error");
          //   }
          // } catch (error) {
          //   // Handle error or show error message
          // }

          try {
            const res = await deleteReviews(id);

            if ("error" in res) {
              console.error("Delete reviews error:", res.error);

              // Safely check for nested error data
              if (res.error && typeof res.error === "object" && "data" in res.error) {
                const errorData = (res.error as { data?: { message?: string } }).data;
                if (typeof errorData?.message === "string") {
                  return Swal.fire("Error", errorData.message, "error");
                }
              }

              return Swal.fire("Error", "Failed to delete product reviews. Please try again.", "error");
            }

            // Success path
            if ("data" in res && res.data && typeof res.data === "object") {
              const message = (res.data as { message?: string }).message;
              Swal.fire("Deleted!", message || "Reviews deleted successfully.", "success");
            } else {
              Swal.fire("Error", "Product reviews not found.", "error");
            }

          } catch (err) {
            console.error("Unexpected error while deleting reviews:", err);
            Swal.fire("Error", "An unexpected error occurred while deleting reviews.", "error");
          }
        }
      });
    }
  };
  return (
    <div className="flex items-center justify-end space-x-2">
      <div className="relative">
        <button
          onClick={() => handleDelete(id)}
          onMouseEnter={() => setShowDelete(true)}
          onMouseLeave={() => setShowDelete(false)}
          className="w-10 h-10 leading-[33px] text-tiny bg-white border border-gray text-slate-600 rounded-md hover:bg-danger hover:border-danger hover:text-white"
        >
          <Delete />
        </button>
        <DeleteTooltip showDelete={showDelete} />
      </div>
    </div>
  );
};

export default DeleteReviews;
