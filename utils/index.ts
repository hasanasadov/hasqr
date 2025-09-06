// import { SelectOptionType } from "@/types";
// type SelectOptionType = {
//   value: string;
//   label: string;
// };
// export function findUniqueOptions(options?: SelectOptionType[]) {
//   const seen = new Set<string>();
//   for (let i = options?.length ? options.length - 1 : -1; i >= 0; i--) {
//     if (options && seen.has(options[i].label)) {
//       options.splice(i, 1); // remove duplicate
//     } else if (options) {
//       seen.add(options[i].label);
//     }
//   }
// }
