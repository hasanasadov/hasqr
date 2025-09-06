export type DetailPageProps = {
  params: Promise<{
    id: string;
  }>;
};

export enum CardTypeDashboard {
  Example = "example",
}

export type SelectOptionType = {
  value: string;
  label: string;
};
