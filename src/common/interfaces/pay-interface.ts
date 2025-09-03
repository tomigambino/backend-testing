export interface InitialPay {
  mpPreferenceId: string;   // result.id de MP
  mpInitPoint: string;      // result.init_point de MP
  mpState: string;          // "pending" o "created"
  amount: number;           // total de la venta
  creationDate: Date;       // new Date() o result.date_created
}