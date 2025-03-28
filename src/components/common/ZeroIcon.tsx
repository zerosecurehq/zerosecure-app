export default function ZeroIcon({
  width,
  height,
}: {
  width: number;
  height: number;
}) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={width}
      height={height}
      fill="none"
      viewBox="0 0 200 200"
      version="1.1"
    >
      <path
        fill='url("#SvgjsLinearGradient2822")'
        fill-rule="evenodd"
        d="M100 0H0v100h100v100h100V100H100V0Z"
        clip-rule="evenodd"
      ></path>
      <defs>
        <linearGradient
          gradientTransform="rotate(0 0.5 0.5)"
          id="SvgjsLinearGradient2822"
        >
          <stop
            stop-opacity=" 1"
            stop-color="rgba(43, 127, 255)"
            offset="0"
          ></stop>
          <stop
            stop-opacity=" 1"
            stop-color="rgba(43, 127, 255)"
            offset="0.48"
          ></stop>
          <stop
            stop-opacity=" 1"
            stop-color="rgba(43, 127, 255)"
            offset="1"
          ></stop>
        </linearGradient>
      </defs>
    </svg>
  );
}
