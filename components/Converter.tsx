'use client'

import * as React from 'react'
import { Input } from '@/components/ui/input'
import { formatCurrency } from '@/utils/utils'
import Image from 'next/image'
import { useState } from 'react'

import { Select } from '@/components/ui/select'

export const Converter: React.FC<ConverterProps> = ({ symbol, icon, priceList }) => {
  const [currency, setCurrency] = useState('usd')
  const [amount, setAmount] = useState('10')

  const convertedPrice = (parseFloat(amount) || 0) * (priceList[currency] || 0)

  return (
    <div id="converter">
      <h4>{symbol.toUpperCase()} Converter</h4>

      <div className="panel">
        <div className="input-wrapper">
          <Input
            type="number"
            placeholder="Amount"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="input"
          />
          <div className="coin-info">
            <Image src={icon} alt={symbol} width={20} height={20} />
            <p>{symbol.toUpperCase()}</p>
          </div>
        </div>

        <div className="divider">
          <div className="line" />

          <Image src="/converter.svg" alt="converter" width={32} height={32} className="icon" />
        </div>

        <div className="output-wrapper">
          <p>
            {formatCurrency({
              value: convertedPrice,
              digits: 2,
              currency,
              showSymbol: false,
            })}
          </p>

          <Select value={currency} onValueChange={(value) => setCurrency(value ?? 'usd')}>
            <Select.Trigger className="select-trigger" value={currency}>
              <Select.Value placeholder="Select" className="select-value">
                {currency.toUpperCase()}
              </Select.Value>
            </Select.Trigger>
            <Select.Content className="select-content" data-converter>
              {Object.keys(priceList).map((currencyCode) => (
                <Select.Item value={currencyCode} key={currencyCode} className="select-item">
                  {currencyCode.toUpperCase()}
                </Select.Item>
              ))}
            </Select.Content>
          </Select>
        </div>
      </div>
    </div>
  )
}
