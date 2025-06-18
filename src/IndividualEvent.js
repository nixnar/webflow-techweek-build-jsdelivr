import React from "react";
export default function IndividualEvent({
  item,
  windowWidth,
  hasLink,
  className,
}) {
  const hosts = item.hosts.split("|");

  return (
    <div
      key={item.title}
      className="border-b-[1px] border-white flex flex-col p-4"
    >
      <div className="flex justify-start items-center">
        <div className="flex gap-2">
          {hosts.map((host) => (
            <p
              key={host}
              className="bg-gradient-to-r from-[#fee646] to-[#2cd4df] bg-clip-text text-transparent uppercase"
            >
              {host}
            </p>
          ))}
        </div>
      </div>
      <h3 className="text-2xl font-bold">{item.title}</h3>
      <p>{item.description}</p>
    </div>
  );
}
