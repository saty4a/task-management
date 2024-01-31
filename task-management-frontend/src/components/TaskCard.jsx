import React from "react";
import Routes from "../routes/route";

const TaskCard = ({data}) => {
    const { routeChange } = Routes();
    return (
        <div onClick={() => routeChange(`/task-details/${data._id}`)} className="w-full max-w-[40ch] md:max-w-[60ch] xl:max-w-[100ch] bg-[#122736] border border-white border-solid uppercase py-2 duration-300 relative after:absolute after:top-0 after:right-full after:bg-white after:z-10 after:w-full after:h-full overflow-hidden hover:after:translate-x-full after:duration-300 hover:text-slate-900">
            <p className="relative z-20 text-lg ps-2 overflow-auto">{data?.title}</p>
        </div>
    )
}

export default TaskCard;