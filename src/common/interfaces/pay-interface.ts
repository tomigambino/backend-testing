export interface PayInterface {
  mpPreferenceId: string;       // ID de la preferencia de pago (devuelto por MP)
  mpInitPoint: string;          // URL para redirigir al Checkout Pro
  mpPaymentMethod: string;   // Método de pago (se completa vía webhook)
  mpState: string; // Estado del pago
  amount: number;               // Total de la venta
  creationDate: Date;           // Fecha de creación de la preferencia
  approvalDate: Date;   // Fecha de aprobación (solo si se aprueba el pago)
}
