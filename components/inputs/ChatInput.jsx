import React from 'react';

const ChatInput = (editMessage) => {
return (
    
    <div
    className={`absolute bg-gray-700 bottom-24 w-full ${
      replyTo === null ? "pt-5" : "pt-3"
    }  pb-10  px-7 border-t border-t-gray-600 z-30 `}
  >
    <div className="h-full">
      {replyTo !== null && (
        <div className="flex items-center space-x-1 mb-2">
          <div className="text-gray-300">Replying to</div>
          <div className="text-green-500"> {replyTo.user.name}</div>
        </div>
      )}
      <form
        onSubmit={replyTo === null ? createMessage : createReply}
        className={`${
          replyTo !== null && "border border-green-500"
        } h-full flex items-center bg-gray-600`}
      >
        {replyTo === null && (
          <div className="ml-3">
            <Tooltip
              placement="bottom"
              content={
                task ? "Remove Task Designation" : "Assign as Task"
              }
              animate={{
                mount: { scale: 1, y: 0 },
                unmount: { scale: 0, y: 1 },
              }}
              className="hidden sm:flex px-3 py-2 rounded-md text-xs text-green-500 font-bold bg-transparent z-50"
            >
              <div
                onClick={handleTaskDesignation}
                className={`h-7 w-7 rounded-full ${
                  task ? "bg-green-300" : "border border-gray-500"
                }  flex justify-center items-center cursor-pointer`}
              >
                <TaskIcon />
              </div>
            </Tooltip>
          </div>
        )}

        <input
          ref={ref}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="w-full py-3 px-5 bg-gray-600  outline-none text-gray-400"
          type="text"
          placeholder={
            replyTo !== null
              ? `Reply to ${replyTo.user.name}`
              : `Type ${task ? "Task" : "Message"}`
          }
        />
        {task && (
          <div className="mx-3 text-sm border border-green-500 text-green-500 px-5 rounded-sm">
            Task
          </div>
        )}
      </form>
      {replyTo !== null && (
        <div
          onClick={handleUnfocusInput}
          className="text-green-500 text-xs cursor-pointer mt-3"
        >
          Cancel
        </div>
      )}
    </div>
  </div>
)
}