import Image from "next/image";

export interface IButton {
  id: number;
  title?: string;
  color?: string;
  text?: string;
  value?: number;
}

export const Presel_form: React.FC<IButton> = (props) => {
  const text: Array<string> = [
    "Free-sale:",
    "Pre-sale:",
    "Public-sale:",
    "Total Minted:",
    "Current Price:",
  ];
  return (
    <div className="presel-gradient rounded-xl text-left p-5 mt-6 sm:mt-0">
      <p className="text-sm">{props.title}</p>
      <h5 className="text-white">{text[props.id]}</h5>
      <div className="text-center">
        <button
          className={`${props.color} text-white w-4/5 mt-3 p-2 rounded-md border-1 border-gray-400`}
        >
          {props.value}
          {props.text}
        </button>
      </div>
    </div>
  );
};
export const CurrentPrice_form: React.FC<IButton> = (props) => {
  return (
    <div className="presel-gradient rounded-xl text-left p-5 ">
      <p className="text-sm">
        <br />
      </p>
      <p className="text-white text-[16px]">Current Price:</p>
      <div className="flex text-center justify-center items-center">
        <div
          className={`${props.color} text-white w-4/5 mt-3 p-2 rounded-md border-1 border-gray-400 flex justify-center items-center`}
        >
          <Image src="/img/coin.png" alt="coin icon" width={24} height={24} />
          <span className="text-xl">&nbsp;{props.value}</span>
        </div>
      </div>
    </div>
  );
};
