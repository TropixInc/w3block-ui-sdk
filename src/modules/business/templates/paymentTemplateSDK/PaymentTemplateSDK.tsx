import { useState } from 'react';

import { InternalPagesLayoutBase } from '../../../shared';
import './index.css';
export const PaymentTemplateSDK = () => {
  const [valueToPay, setValueToPay] = useState('0');
  const [code, setCode] = useState(['', '', '', '']);
  return (
    <InternalPagesLayoutBase>
      <div className="pw-p-6 pw-bg-white pw-rounded-[20px] pw-shadow ">
        <p className="pw-text-black pw-text-[23px] pw-font-semibold pw-leading-loose">
          Pagamento
        </p>
        <div className="pw-p-4 pw-rounded-2xl pw-border pw-border-zinc-100">
          <p className="pw-text-sm pw-text-zinc-700 pw-font-semibold">
            Valor a ser pago
          </p>
          <input
            placeholder="Apenas numeros"
            type="number"
            value={valueToPay}
            onChange={(e) => setValueToPay(e.target.value)}
            className="pw-text-[13px] pw-text-black pw-p-[10px] pw-border pw-border-blue-600 pw-rounded-lg pw-w-full"
          />
        </div>
        <div className="sm:pw-flex-col pw-flex first-letter pw-gap-[32px]">
          <div className="pw-p-4 pw-rounded-2xl pw-shadow pw-border pw-border-zinc-100 pw-flex-col pw-justify-center pw-items-center">
            <p className="pw-text-zinc-700 pw-text-sm sm:pw-text-lg pw-font-medium pw-leading-[23px] pw-max-w-[260px]">
              Por favor solicite o código ao cliente e digite abaixo:
            </p>
            <div className="pw-flex pw-justify-center pw-items-center">
              {code.map((_, index) => (
                <input
                  key={index}
                  type="number"
                  maxLength={1}
                  onChange={(e) =>
                    setCode((prev) => {
                      const newCode = [...prev];
                      newCode[index] = e.target.value;
                      return newCode;
                    })
                  }
                  style={{
                    width: '40px',
                    height: '40px',
                  }}
                  className="pw-text-[16px] pw-text-black pw-p-[6px] pw-border pw-border-blue-600 pw-rounded-lg pw-w-full"
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </InternalPagesLayoutBase>
  );
};
