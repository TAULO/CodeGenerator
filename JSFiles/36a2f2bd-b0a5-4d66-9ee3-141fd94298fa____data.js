import { verificationDigit } from '../../../utils/formulas';

import { SHA384 } from 'crypto-js';
import _ from 'lodash';
import moment from 'moment';
import { countryList } from '../../../utils/country';
const countryMapper = (country) => {
  const { key } = _.find(countryList, { value: country });
  return key.toUpperCase();
};

const getTaxesInvoices = (items, currency) => {
  let TaxAmount = 0;
  let hasTax = false;
  const tax = {};
  items.forEach((prod) => {
    if (prod.taxed) {
      hasTax = true;
      if (!tax[prod.vatPercentage]) {
        tax[prod.vatPercentage] = {
          TaxAmount: prod.vat,
          TaxableAmount: prod.subtotal,
        };
      } else {
        tax[prod.vatPercentage].TaxAmount += prod.vat;
        tax[prod.vatPercentage].TaxableAmount += prod.subtotal;
      }
      TaxAmount += prod.vat;
    }
  });
  if (hasTax)
    return `
  <cac:TaxTotal>
    <cbc:TaxAmount currencyID="${currency}">${TaxAmount.toFixed(
      2
    )}</cbc:TaxAmount>
    ${Object.entries(tax)
      .map(([key, { TaxAmount, TaxableAmount }]) => {
        return `
          <cac:TaxSubtotal>
              <cbc:TaxableAmount currencyID="${currency}">${Number(
          TaxableAmount
        ).toFixed(2)}</cbc:TaxableAmount>
              <cbc:TaxAmount currencyID="${currency}">${Number(
          TaxAmount
        ).toFixed(2)}</cbc:TaxAmount>
              <cac:TaxCategory>
                <cbc:Percent>${Number(key).toFixed(2)}</cbc:Percent>
                <cac:TaxScheme>
                    <cbc:ID>01</cbc:ID>
                    <cbc:Name>IVA</cbc:Name>
                </cac:TaxScheme>
              </cac:TaxCategory>
          </cac:TaxSubtotal>
      `;
      })
      .join('')}
    </cac:TaxTotal>
  `;
  return '\n';
};

export const cufeGen = (props) => {
  const {
    InvoiceNumber,
    IssueDate,
    IssueTime,
    LineExtensionAmount,
    TaxAmount,
    ValImp2,
    ValImp3,
    PayableAmount,
    CompanyNIT,
    CustomerNIT,
    ClTec,
    ProfileExecutionID,
  } = props;

  const CUFE = `${
    InvoiceNumber +
    IssueDate +
    IssueTime +
    LineExtensionAmount +
    '01' +
    TaxAmount +
    '04' +
    ValImp2 +
    '03' +
    ValImp3 +
    PayableAmount +
    CompanyNIT +
    CustomerNIT +
    ClTec +
    ProfileExecutionID
  }`;
  return SHA384(CUFE).toString();
};

const cudeGen = ({
  NoteNumber,
  IssueDate,
  IssueTime,
  LineExtensionAmount,
  TaxAmount,
  ValImp2,
  ValImp3,
  PayableAmount,
  CompanyNIT,
  CustomerNIT,
  PIN,
  ProfileExecutionID,
}) => {
  const CUDE = `${
    NoteNumber +
    IssueDate +
    IssueTime +
    LineExtensionAmount +
    '01' +
    TaxAmount +
    '04' +
    ValImp2 +
    '03' +
    ValImp3 +
    PayableAmount +
    CompanyNIT +
    CustomerNIT +
    PIN +
    ProfileExecutionID
  }`;
  return SHA384(CUDE).toString();
};

const invoiceLine = ({
  items,
  Currency,
  lineName = 'Invoice',
  operation = false,
  CustomerNIT,
}) => {
  let invoice = '';
  const quantity =
    lineName === 'Invoice' ? 'Invoic' : lineName.split('Note')[0];
  items.map((prod, idx) => {
    const { incomeType, nationalID, idType } = JSON.parse(prod.extra);
    invoice += `
    <cac:${lineName}Line>
      <cbc:ID ${operation ? `schemeID="${incomeType}"` : ''}>${idx + 1}</cbc:ID>
      <cbc:${quantity}edQuantity unitCode="${prod.productService.unit.code}">${
      prod.quantity
    }</cbc:${quantity}edQuantity>
      <cbc:LineExtensionAmount currencyID="${Currency}">${prod.subtotal.toFixed(
      2
    )}</cbc:LineExtensionAmount>
        ${
          Number(prod.total) === 0
            ? `
        <cac:PricingReference>
            <cac:AlternativeConditionPrice>
              <cbc:PriceAmount currencyID="${Currency}">${prod.discount.toFixed(
                2
              )}</cbc:PriceAmount>
              <cbc:PriceTypeCode>01</cbc:PriceTypeCode>
            </cac:AlternativeConditionPrice>
          </cac:PricingReference>
        
        `
            : '\n'
        }
        ${
          prod.discounted && lineName === 'Invoice'
            ? `<cac:AllowanceCharge>
              <cbc:ID>1</cbc:ID>
              <cbc:ChargeIndicator>false</cbc:ChargeIndicator>
              <cbc:AllowanceChargeReason>Descuento por cliente frecuente</cbc:AllowanceChargeReason>
              <cbc:MultiplierFactorNumeric>${prod.discountPercentage.toFixed(
                2
              )}</cbc:MultiplierFactorNumeric>
              <cbc:Amount currencyID="${Currency}">${prod.discount.toFixed(
                2
              )}</cbc:Amount>
              <cbc:BaseAmount currencyID="${Currency}">${(
                prod.unitPrice * prod.quantity
              ).toFixed(2)}</cbc:BaseAmount>
              </cac:AllowanceCharge>`
            : '\n'
        }
      ${
        prod.taxed
          ? `<cac:TaxTotal>
        <cbc:TaxAmount currencyID="${Currency}">${prod.vat.toFixed(
              2
            )}</cbc:TaxAmount>
          <cac:TaxSubtotal>
            <cbc:TaxableAmount currencyID="${Currency}">${prod.subtotal.toFixed(
              2
            )}</cbc:TaxableAmount>
            <cbc:TaxAmount currencyID="${Currency}">${prod.vat.toFixed(
              2
            )}</cbc:TaxAmount>
            <cbc:BaseUnitMeasure unitCode="${
              prod.productService.unit.code
            }">1.00</cbc:BaseUnitMeasure>
            <cac:TaxCategory>
              <cbc:Percent>${prod.vatPercentage.toFixed(2)}</cbc:Percent>
              <cac:TaxScheme>
                <cbc:ID>01</cbc:ID>
                <cbc:Name>IVA</cbc:Name>
              </cac:TaxScheme>
            </cac:TaxCategory>
          </cac:TaxSubtotal>
        </cac:TaxTotal>`
          : '\n'
      }

      ${
        prod.retention > 0 && lineName === 'Invoice'
          ? `<cac:WithholdingTaxTotal>
       <cbc:TaxAmount currencyID="${Currency}">${prod.retention}</cbc:TaxAmount>
       <cbc:TaxEvidenceIndicator>true</cbc:TaxEvidenceIndicator>
       <cac:TaxSubtotal>
         <cbc:TaxableAmount currencyID="${Currency}">${prod.subtotal}</cbc:TaxableAmount>
         <cbc:TaxAmount currencyID="${Currency}">${prod.retention}</cbc:TaxAmount>
         <cac:TaxCategory>
           <cbc:Percent>${prod.retentionPercentage}</cbc:Percent>
           <cac:TaxScheme>
             <cbc:ID>06</cbc:ID>
             <cbc:Name>ReteFuente</cbc:Name>
           </cac:TaxScheme>
         </cac:TaxCategory>
       </cac:TaxSubtotal>
     </cac:WithholdingTaxTotal>`
          : '\n'
      }
      <cac:Item>
        <cbc:Description>${
          prod?.comment || prod.productService.name
        }</cbc:Description>
        <cac:StandardItemIdentification>
          <cbc:ID schemeID="999">${prod.productService.code}</cbc:ID>
        </cac:StandardItemIdentification>
        ${
          operation
            ? `
              <cac:InformationContentProviderParty>
                  <cac:PowerOfAttorney>
                    <cac:AgentParty>
                        <cac:PartyIdentification>
                          <cbc:ID schemeAgencyID="195" schemeID="${verificationDigit(
                            nationalID
                          )}" schemeName="${idType}">${nationalID}</cbc:ID>
                        </cac:PartyIdentification>
                    </cac:AgentParty>
                  </cac:PowerOfAttorney>
              </cac:InformationContentProviderParty>
              `
            : '\n'
        }

      </cac:Item>
      <cac:Price>
        <cbc:PriceAmount currencyID="${Currency}">${prod.unitPrice.toFixed(
      2
    )}</cbc:PriceAmount>
        <cbc:BaseQuantity unitCode="EA">${prod.quantity.toFixed(
          2
        )}</cbc:BaseQuantity>
      </cac:Price>
    </cac:${lineName}Line>`;

    return prod;
  });

  return invoice;
};
const fiscalGen = (fiscalResponsabilities, regimenType, ProfileExecutionID) => {
  let fiscal = '';

  for (const fis of fiscalResponsabilities) {
    fiscal += `
      <cbc:TaxLevelCode listName="${regimenType.code}">${fis.fiscalResponsability.code}</cbc:TaxLevelCode>
      `;
  }
  if (fiscal === '' && ProfileExecutionID === 2) {
    fiscal = '<cbc:TaxLevelCode listName="49">O-47</cbc:TaxLevelCode>';
  }

  return fiscal;
};

const invoiceGen = (props) => {
  const {
    InvoiceAuthorization,
    StartDate,
    EndDate,
    Prefix,
    From,
    To,
    SoftwareID,
    PIN,
    IssueDate,
    IssueTime,
    ValImp2 = '0.00',
    ValImp3 = '0.00',
    CompanyName,
    CustomizationID,
    CompanyNIT,
    ProfileExecutionID = 2,
    InvoiceNumber,
    InvoiceTypeCode,
    items,
    InvoicePeriodStart,
    InvoicePeriodEnd,
    ClTec = 'fc8eac422eba16e22ffd8c6f94b3f40a6e38162c',
    SetTestID,
    CompanyPostCode,
    CompanyCity,
    CompanyDepartament,
    CompanyDepartamentCode,
    CompanyAddress,
    CompanyEmail,
    RegimenCode,
    TaxLevelCode,
    fiscalResponsabilities,
    regimenType,
    CompanyCityCode,
    TaxSchemeID,
    TaxSchemeName,
    AdditionalAccountID,
    CustomerID,
    CustomerName,
    CustomerCountry = 'Colombia',
    CustomerCity,
    CustomerCityCode,
    CustomerDeparment,
    CustomerDeparmentCode,
    CustomerAddress,
    CustomerNITCode,
    CustomerNIT,
    CustomerEmail,
    PaymentMeansID,
    PaymentMeansCode,
    PaymentDueDate,
    TaxableAmount,
    TaxAmount,
    Percent,
    LineExtensionAmount,
    TaxInclusiveAmount,
    TaxExclusiveAmount,
    PayableAmount,
    Currency = 'COP',
    ExchangeRate,
    OrderReferenceID,
  } = props;
  const UUID = cufeGen({
    InvoiceNumber,
    IssueDate,
    IssueTime,
    LineExtensionAmount,
    TaxAmount,
    ValImp2,
    ValImp3,
    PayableAmount,
    CompanyNIT,
    CustomerNIT,
    ClTec,
    ProfileExecutionID,
  });
  const LineCountNumeric = items.length;
  const operation =
    Number(CustomizationID) === 11 || Number(CustomizationID) === 12;
  return {
    CUFE: UUID,
    file: `<?xml version="1.0" encoding="UTF-8" standalone="no"?>
    <Invoice xmlns="urn:oasis:names:specification:ubl:schema:xsd:Invoice-2" xmlns:cac="urn:oasis:names:specification:ubl:schema:xsd:CommonAggregateComponents-2" xmlns:cbc="urn:oasis:names:specification:ubl:schema:xsd:CommonBasicComponents-2" xmlns:ds="http://www.w3.org/2000/09/xmldsig#" xmlns:ext="urn:oasis:names:specification:ubl:schema:xsd:CommonExtensionComponents-2" xmlns:sts="dian:gov:co:facturaelectronica:Structures-2-1" xmlns:xades="http://uri.etsi.org/01903/v1.3.2#" xmlns:xades141="http://uri.etsi.org/01903/v1.4.1#" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xsi:schemaLocation="urn:oasis:names:specification:ubl:schema:xsd:Invoice-2 http://docs.oasis-open.org/ubl/os-UBL-2.1/xsd/maindoc/UBL-Invoice-2.1.xsd">
     <ext:UBLExtensions>
        <ext:UBLExtension>
          <ext:ExtensionContent>
            <sts:DianExtensions>
              <sts:InvoiceControl>
                <sts:InvoiceAuthorization>${InvoiceAuthorization}</sts:InvoiceAuthorization>
                <sts:AuthorizationPeriod>
                  <cbc:StartDate>${StartDate}</cbc:StartDate>
                  <cbc:EndDate>${EndDate}</cbc:EndDate>
                </sts:AuthorizationPeriod>
                <sts:AuthorizedInvoices>
                  <sts:Prefix>${Prefix}</sts:Prefix>
                  <sts:From>${From}</sts:From>
                  <sts:To>${To}</sts:To>
                </sts:AuthorizedInvoices>
              </sts:InvoiceControl>
            </sts:DianExtensions>
          </ext:ExtensionContent>
        </ext:UBLExtension>
      </ext:UBLExtensions>
      <cbc:CustomizationID>${CustomizationID}</cbc:CustomizationID>
      <cbc:ProfileExecutionID>${ProfileExecutionID}</cbc:ProfileExecutionID>
      <cbc:ID>${InvoiceNumber}</cbc:ID>
      <cbc:UUID schemeID="${ProfileExecutionID}" schemeName="CUFE-SHA384">${UUID}</cbc:UUID>
      <cbc:IssueDate>${IssueDate}</cbc:IssueDate>
      <cbc:IssueTime>${IssueTime}</cbc:IssueTime>
      <cbc:InvoiceTypeCode>${InvoiceTypeCode}</cbc:InvoiceTypeCode>
      <cbc:Note>Factura Electronica</cbc:Note>
      <cbc:DocumentCurrencyCode listAgencyID="6" listAgencyName="United Nations Economic Commission for Europe" listID="ISO 4217 Alpha">${Currency}</cbc:DocumentCurrencyCode>

      <cbc:LineCountNumeric>${LineCountNumeric}</cbc:LineCountNumeric>
      <cac:InvoicePeriod>
        <cbc:StartDate>${InvoicePeriodStart}</cbc:StartDate>
        <cbc:EndDate>${InvoicePeriodEnd}</cbc:EndDate>
     </cac:InvoicePeriod>
     ${
       OrderReferenceID !== ''
         ? ` <cac:OrderReference>
      <cbc:ID>${OrderReferenceID}</cbc:ID>
    </cac:OrderReference>`
         : '\n'
     }
      <cac:AccountingSupplierParty>
        <cbc:AdditionalAccountID>1</cbc:AdditionalAccountID>
        <cac:Party>
          <cac:PartyName>
            <cbc:Name>${CompanyName}</cbc:Name>
          </cac:PartyName>
          <cac:PhysicalLocation>
            <cac:Address>
              <cbc:ID>${CompanyPostCode}</cbc:ID>
              <cbc:CityName>${CompanyCity}</cbc:CityName>
              <cbc:CountrySubentity>${CompanyDepartament}</cbc:CountrySubentity>
              <cbc:CountrySubentityCode>${CompanyDepartamentCode}</cbc:CountrySubentityCode>
              <cac:AddressLine>
                <cbc:Line>${CompanyAddress}</cbc:Line>
              </cac:AddressLine>
              <cac:Country>
                <cbc:IdentificationCode>CO</cbc:IdentificationCode>
                <cbc:Name languageID="es">Colombia</cbc:Name>
              </cac:Country>
            </cac:Address>
          </cac:PhysicalLocation>
          <cac:PartyTaxScheme>
            <cbc:RegistrationName>${CompanyName}</cbc:RegistrationName>
            <cbc:CompanyID schemeID="${verificationDigit(
              CompanyNIT
            )}" schemeName="31" schemeAgencyID="195" schemeAgencyName="CO, DIAN (Dirección de Impuestos y Aduanas Nacionales)">${CompanyNIT}</cbc:CompanyID>
            
            ${fiscalGen(
              fiscalResponsabilities,
              regimenType,
              ProfileExecutionID
            )}

            <!--Régimen Fiscal: cbc:TaxLevelCode.@listName 6.2.4.,+ Responsabilidades fiscales: cbc:TaxLevelCode 6.2.7.[0..1] -->
            <cac:RegistrationAddress>
              <cbc:ID>${CompanyCityCode}</cbc:ID>
              <cbc:CityName>${CompanyCity}</cbc:CityName>
              <cbc:CountrySubentity>${CompanyDepartament}</cbc:CountrySubentity>
              <cbc:CountrySubentityCode>${CompanyDepartamentCode}</cbc:CountrySubentityCode>
              <cac:AddressLine>
                <cbc:Line>${CompanyAddress}</cbc:Line>
              </cac:AddressLine>
              <cac:Country>
                <cbc:IdentificationCode>CO</cbc:IdentificationCode>
                <cbc:Name languageID="es">Colombia</cbc:Name>
              </cac:Country>
            </cac:RegistrationAddress>
            <cac:TaxScheme>
              <cbc:ID>${TaxSchemeID}</cbc:ID>
              <cbc:Name>${TaxSchemeName}</cbc:Name>
            </cac:TaxScheme>
          </cac:PartyTaxScheme>
          <cac:PartyLegalEntity>
            <cbc:RegistrationName>${CompanyName}</cbc:RegistrationName>
            <cbc:CompanyID schemeID="${verificationDigit(
              CompanyNIT
            )}" schemeName="31" schemeAgencyID="195" schemeAgencyName="CO, DIAN (Dirección de Impuestos y Aduanas Nacionales)">${CompanyNIT}</cbc:CompanyID>
            <cac:CorporateRegistrationScheme>
                 <cbc:ID>${Prefix}</cbc:ID>
              </cac:CorporateRegistrationScheme>
          </cac:PartyLegalEntity>
          <cac:Contact>
            <cbc:ElectronicMail>${CompanyEmail}</cbc:ElectronicMail>
          </cac:Contact>
        </cac:Party>
      </cac:AccountingSupplierParty>
      <cac:AccountingCustomerParty>
        <cbc:AdditionalAccountID>${AdditionalAccountID}</cbc:AdditionalAccountID>
            <cac:Party>
              ${
                Number(AdditionalAccountID) === 2
                  ? `
                      <cac:PartyIdentification>
                        <cbc:ID schemeAgencyID="195" schemeAgencyName="CO, DIAN (Dirección de Impuestos y Aduanas Nacionales)" schemeID="${verificationDigit(
                          CustomerNIT
                        )}" schemeName="${CustomerNITCode}">${CustomerNIT}</cbc:ID>
                      </cac:PartyIdentification>
                    `
                  : '\n'
              }
              <cac:PartyName>
                <cbc:Name>${CustomerName}</cbc:Name>
              </cac:PartyName>
              <cac:PhysicalLocation>
                <cac:Address>
                  <cbc:ID>${CustomerCityCode}</cbc:ID>
                  <cbc:CityName>${CustomerCity}</cbc:CityName>
                  <cbc:CountrySubentity>${CustomerDeparment}</cbc:CountrySubentity>
                  <cbc:CountrySubentityCode>${CustomerDeparmentCode}</cbc:CountrySubentityCode>
                  <cac:AddressLine>
                    <cbc:Line>${CustomerAddress}</cbc:Line>
                  </cac:AddressLine>
                  <cac:Country>
                    <cbc:IdentificationCode>${countryMapper(
                      CustomerCountry
                    )}</cbc:IdentificationCode>
                    <cbc:Name languageID="es">${CustomerCountry}</cbc:Name>
                  </cac:Country>
                </cac:Address>
              </cac:PhysicalLocation>
              <cac:PartyTaxScheme>
                <cbc:RegistrationName>${CustomerName}</cbc:RegistrationName>
                <cbc:CompanyID schemeID="${verificationDigit(
                  CustomerNIT
                )}" schemeName="${CustomerNITCode}" schemeAgencyID="195" schemeAgencyName="CO, DIAN (Dirección de Impuestos y Aduanas Nacionales)">${CustomerNIT}</cbc:CompanyID>
                <cbc:TaxLevelCode listName="${RegimenCode}">${TaxLevelCode}</cbc:TaxLevelCode>

                <!--Régimen Fiscal: cbc:TaxLevelCode.@listName 6.2.4.,+ Responsabilidades fiscales: cbc:TaxLevelCode 6.2.7.[0..1] -->
                <cac:TaxScheme>
                  <cbc:ID>ZZ</cbc:ID>
                  <cbc:Name>No aplica</cbc:Name>
                </cac:TaxScheme>
              </cac:PartyTaxScheme>
              <cac:PartyLegalEntity>
                <cbc:RegistrationName>${CustomerName}</cbc:RegistrationName>
                <cbc:CompanyID schemeID="${verificationDigit(
                  CustomerNIT
                )}" schemeName="${CustomerNITCode}" schemeAgencyID="195" schemeAgencyName="CO, DIAN (Dirección de Impuestos y Aduanas Nacionales)">${CustomerNIT}</cbc:CompanyID>
              </cac:PartyLegalEntity>
              <cac:Contact>
                <cbc:ElectronicMail>${CustomerEmail}</cbc:ElectronicMail>
              </cac:Contact>
              
            </cac:Party>
          </cac:AccountingCustomerParty>

          <cac:PaymentMeans>
            <!--Grupo de campos para información relacionadas con el pago de la factura. [1..N] -->
            <cbc:ID>${PaymentMeansID}</cbc:ID>
            <cbc:PaymentMeansCode>${PaymentMeansCode}</cbc:PaymentMeansCode>
            <cbc:PaymentDueDate>${PaymentDueDate}</cbc:PaymentDueDate>
          </cac:PaymentMeans>

          
          ${
            Currency !== 'COP'
              ? `<cac:PaymentExchangeRate>
                  <cbc:SourceCurrencyCode>${Currency}</cbc:SourceCurrencyCode>
                  <cbc:SourceCurrencyBaseRate>1.00</cbc:SourceCurrencyBaseRate>
                  <cbc:TargetCurrencyCode>COP</cbc:TargetCurrencyCode>
                  <cbc:TargetCurrencyBaseRate>1.00</cbc:TargetCurrencyBaseRate>
                  <cbc:CalculationRate>${ExchangeRate}</cbc:CalculationRate>
                  <cbc:Date>${moment().format('YYYY-MM-DD')}</cbc:Date>
                </cac:PaymentExchangeRate>`
              : '\n'
          }

          ${getTaxesInvoices(items, Currency)}

          <cac:LegalMonetaryTotal>
            <!--Grupo de campos para información relacionadas con los valores totales aplicables a la factura [1..1]-->
            <cbc:LineExtensionAmount currencyID="${Currency}">${LineExtensionAmount}</cbc:LineExtensionAmount>
            <cbc:TaxExclusiveAmount currencyID="${Currency}">${TaxExclusiveAmount}</cbc:TaxExclusiveAmount>
            <cbc:TaxInclusiveAmount currencyID="${Currency}">${TaxInclusiveAmount}</cbc:TaxInclusiveAmount>
            <cbc:PayableAmount currencyID="${Currency}">${PayableAmount}</cbc:PayableAmount>
          </cac:LegalMonetaryTotal>
          ${invoiceLine({ items, Currency, CustomerNIT, operation })}
          <DATA>
            <UBL21>true</UBL21>
            <Partnership>
              <ID>901441896</ID>
              <!--Identificación de la Alianza [1..1] -->
              <TechKey>${ClTec}</TechKey>
              <!--Clave Técnica [1..1]-->
             ${
               ProfileExecutionID === 2
                 ? `<SetTestID>${SetTestID}</SetTestID>`
                 : '\n'
             }
              <!-- Test ID Sólo Aplica para pruebas [1..1] -->
            </Partnership>
          </DATA>
        </Invoice>`,
  };
};

const noteGen = (props) => {
  const {
    CUFE: cufe,
    PIN,
    PrefixNote,
    IssueDate,
    IssueTime,
    ValImp2 = '0.00',
    ValImp3 = '0.00',
    CompanyName,
    CustomizationID,
    CompanyNIT,
    ProfileExecutionID = 2,
    InvoiceNumber,
    NoteNumber,
    NoteTypeCode,
    items,
    ClTec = 'fc8eac422eba16e22ffd8c6f94b3f40a6e38162c',
    SetTestID,
    CompanyPostCode,
    CompanyCity,
    CompanyDepartament,
    CompanyDepartamentCode,
    CompanyAddress,
    CompanyEmail,
    RegimenCode,
    TaxLevelCode,
    fiscalResponsabilities,
    regimenType,
    CompanyCityCode,
    TaxSchemeID,
    TaxSchemeName,
    AdditionalAccountID,
    CustomerName,
    CustomerCountry = 'Colombia',
    CustomerCity,
    CustomerCityCode,
    CustomerDeparment,
    CustomerDeparmentCode,
    CustomerAddress,
    CustomerNITCode,
    CustomerNIT,
    CustomerEmail,
    PaymentMeansID,
    PaymentMeansCode,
    PaymentDueDate,
    TaxableAmount,
    TaxAmount,
    Percent,
    LineExtensionAmount,
    TaxInclusiveAmount,
    TaxExclusiveAmount,
    PayableAmount,
    type,
    Currency = 'COP',
    OrderReferenceID,
  } = props;

  const LineCountNumeric = items.length;
  const note = _.startCase(_.camelCase(type)).replace(/ /g, '');

  const CUFE = cufeGen({
    InvoiceNumber,
    IssueDate,
    IssueTime,
    LineExtensionAmount,
    TaxAmount,
    ValImp2,
    ValImp3,
    PayableAmount,
    CompanyNIT,
    CustomerNIT,
    ClTec,
    ProfileExecutionID,
  });

  const CUDE = cudeGen({
    NoteNumber,
    IssueDate,
    IssueTime,
    LineExtensionAmount,
    TaxAmount,
    ValImp2,
    ValImp3,
    PayableAmount,
    CompanyNIT,
    CustomerNIT,
    PIN,
    ProfileExecutionID,
  });

  const operation =
    Number(CustomizationID) === 11 || Number(CustomizationID) === 12;

  return {
    CUFE: CUDE,
    file: `<?xml version="1.0" encoding="UTF-8" standalone="no"?>
    <${note} xmlns="urn:oasis:names:specification:ubl:schema:xsd:${note}-2" xmlns:cac="urn:oasis:names:specification:ubl:schema:xsd:CommonAggregateComponents-2" xmlns:cbc="urn:oasis:names:specification:ubl:schema:xsd:CommonBasicComponents-2" xmlns:ext="urn:oasis:names:specification:ubl:schema:xsd:CommonExtensionComponents-2" xmlns:sts="dian:gov:co:facturaelectronica:Structures-2-1" xmlns:xades="http://uri.etsi.org/01903/v1.3.2#" xmlns:xades141="http://uri.etsi.org/01903/v1.4.1#" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xsi:schemaLocation="urn:oasis:names:specification:ubl:schema:xsd:${note}-2     http://docs.oasis-open.org/ubl/os-UBL-2.1/xsd/maindoc/UBL-${note}-2.1.xsd">
      <cbc:CustomizationID>${CustomizationID}</cbc:CustomizationID>
      <cbc:ProfileExecutionID>${ProfileExecutionID}</cbc:ProfileExecutionID>
      <cbc:ID>${NoteNumber}</cbc:ID>
      <cbc:UUID schemeID="${ProfileExecutionID}" schemeName="CUDE-SHA384">${CUDE}</cbc:UUID>
      <cbc:IssueDate>${IssueDate}</cbc:IssueDate>
      <cbc:IssueTime>${IssueTime}</cbc:IssueTime>
      ${
        note === 'CreditNote'
          ? `<cbc:${note}TypeCode>${NoteTypeCode}</cbc:${note}TypeCode>`
          : '\n'
      }
      <cbc:Note>Prueba Factura Electronica Datos Reales 2</cbc:Note>
      <cbc:DocumentCurrencyCode>${Currency}</cbc:DocumentCurrencyCode>
      <cbc:LineCountNumeric>${LineCountNumeric}</cbc:LineCountNumeric>
      ${
        OrderReferenceID !== ''
          ? ` <cac:OrderReference>
        <cbc:ID>${OrderReferenceID}</cbc:ID>
      </cac:OrderReference>`
          : '\n'
      }
      <cac:BillingReference>
      <cac:InvoiceDocumentReference>
        <cbc:ID>${InvoiceNumber}</cbc:ID>
        <cbc:UUID schemeName="CUFE-SHA384">${cufe || CUFE}</cbc:UUID>
        <cbc:IssueDate>${IssueDate}</cbc:IssueDate>
      </cac:InvoiceDocumentReference>
    </cac:BillingReference>
      <cac:AccountingSupplierParty>
        <cbc:AdditionalAccountID>1</cbc:AdditionalAccountID>
        <cac:Party>
          <cac:PartyName>
            <cbc:Name>${CompanyName}</cbc:Name>
          </cac:PartyName>
          <cac:PhysicalLocation>
            <cac:Address>
              <cbc:ID>${CompanyPostCode}</cbc:ID>
              <cbc:CityName>${CompanyCity}</cbc:CityName>
              <cbc:CountrySubentity>${CompanyDepartament}</cbc:CountrySubentity>
              <cbc:CountrySubentityCode>${CompanyDepartamentCode}</cbc:CountrySubentityCode>
              <cac:AddressLine>
                <cbc:Line>${CompanyAddress}</cbc:Line>
              </cac:AddressLine>
              <cac:Country>
                <cbc:IdentificationCode>CO</cbc:IdentificationCode>
                <cbc:Name languageID="es">Colombia</cbc:Name>
              </cac:Country>
            </cac:Address>
          </cac:PhysicalLocation>
          <cac:PartyTaxScheme>
            <cbc:RegistrationName>${CompanyName}</cbc:RegistrationName>
            <cbc:CompanyID schemeID="${verificationDigit(
              CompanyNIT
            )}" schemeName="31" schemeAgencyID="195" schemeAgencyName="CO, DIAN (Dirección de Impuestos y Aduanas Nacionales)">${CompanyNIT}</cbc:CompanyID>
            
            ${fiscalGen(
              fiscalResponsabilities,
              regimenType,
              ProfileExecutionID
            )}
  
            <!--Régimen Fiscal: cbc:TaxLevelCode.@listName 6.2.4.,+ Responsabilidades fiscales: cbc:TaxLevelCode 6.2.7.[0..1] -->
            <cac:RegistrationAddress>
              <cbc:ID>${CompanyCityCode}</cbc:ID>
              <cbc:CityName>${CompanyCity}</cbc:CityName>
              <cbc:CountrySubentity>${CompanyDepartament}</cbc:CountrySubentity>
              <cbc:CountrySubentityCode>${CompanyDepartamentCode}</cbc:CountrySubentityCode>
              <cac:AddressLine>
                <cbc:Line>${CompanyAddress}</cbc:Line>
              </cac:AddressLine>
              <cac:Country>
                <cbc:IdentificationCode>CO</cbc:IdentificationCode>
                <cbc:Name languageID="es">Colombia</cbc:Name>
              </cac:Country>
            </cac:RegistrationAddress>
            <cac:TaxScheme>
              <cbc:ID>${TaxSchemeID}</cbc:ID>
              <cbc:Name>${TaxSchemeName}</cbc:Name>
            </cac:TaxScheme>
          </cac:PartyTaxScheme>
          <cac:PartyLegalEntity>
            <cbc:RegistrationName>${CompanyName}</cbc:RegistrationName>
            <cbc:CompanyID schemeID="${verificationDigit(
              CompanyNIT.toString()
            )}" schemeName="31" schemeAgencyID="195" schemeAgencyName="CO, DIAN (Dirección de Impuestos y Aduanas Nacionales)">${CompanyNIT}</cbc:CompanyID>
            <cac:CorporateRegistrationScheme>
                 <cbc:ID>${PrefixNote}</cbc:ID>
              </cac:CorporateRegistrationScheme>
          </cac:PartyLegalEntity>
          <cac:Contact>
            <cbc:ElectronicMail>${CompanyEmail}</cbc:ElectronicMail>
          </cac:Contact>
        </cac:Party>
      </cac:AccountingSupplierParty>
      <cac:AccountingCustomerParty>
      <cbc:AdditionalAccountID>${AdditionalAccountID}</cbc:AdditionalAccountID>
          <cac:Party>
            <cac:PartyName>
              <cbc:Name>${CustomerName}</cbc:Name>
            </cac:PartyName>
            <cac:PhysicalLocation>
              <cac:Address>
               ${
                 CustomerCountry === 'Colombia'
                   ? ` <cbc:ID>${CustomerCityCode}</cbc:ID>`
                   : '<cbc:ID/>'
               }
                <cbc:CityName>${CustomerCity}</cbc:CityName>
                <cbc:CountrySubentity>${CustomerDeparment}</cbc:CountrySubentity>
                <cbc:CountrySubentityCode>${CustomerDeparmentCode}</cbc:CountrySubentityCode>
                <cac:AddressLine>
                  <cbc:Line>${CustomerAddress}</cbc:Line>
                </cac:AddressLine>
                <cac:Country>
                    <cbc:IdentificationCode>${countryMapper(
                      CustomerCountry
                    )}</cbc:IdentificationCode>
                    <cbc:Name languageID="es">${CustomerCountry}</cbc:Name>
                </cac:Country>
              </cac:Address>
            </cac:PhysicalLocation>
            <cac:PartyTaxScheme>
              <cbc:RegistrationName>${CustomerName}</cbc:RegistrationName>
              <cbc:CompanyID schemeID="${verificationDigit(
                CustomerNIT
              )}" schemeName="${CustomerNITCode}" schemeAgencyID="195" schemeAgencyName="CO, DIAN (Dirección de Impuestos y Aduanas Nacionales)">${CustomerNIT}</cbc:CompanyID>
              <cbc:TaxLevelCode listName="${RegimenCode}">${TaxLevelCode}</cbc:TaxLevelCode>

              <!--Régimen Fiscal: cbc:TaxLevelCode.@listName 6.2.4.,+ Responsabilidades fiscales: cbc:TaxLevelCode 6.2.7.[0..1] -->
              <cac:TaxScheme>
                <cbc:ID>ZZ</cbc:ID>
                <cbc:Name>No aplica</cbc:Name>
              </cac:TaxScheme>
            </cac:PartyTaxScheme>
            <cac:PartyLegalEntity>
              <cbc:RegistrationName>${CustomerName}</cbc:RegistrationName>
              <cbc:CompanyID schemeID="${verificationDigit(
                CustomerNIT
              )}" schemeName="${CustomerNITCode}" schemeAgencyID="195" schemeAgencyName="CO, DIAN (Dirección de Impuestos y Aduanas Nacionales)">${CustomerNIT}</cbc:CompanyID>
            </cac:PartyLegalEntity>
            <cac:Contact>
              <cbc:ElectronicMail>${CustomerEmail}</cbc:ElectronicMail>
            </cac:Contact>
          </cac:Party>
        </cac:AccountingCustomerParty>

        <cac:PaymentMeans>
            <!--Grupo de campos para información relacionadas con el pago de la factura. [1..N] -->
            <cbc:ID>${PaymentMeansID}</cbc:ID>
            <cbc:PaymentMeansCode>${PaymentMeansCode}</cbc:PaymentMeansCode>
            <cbc:PaymentDueDate>${PaymentDueDate}</cbc:PaymentDueDate>
          </cac:PaymentMeans>
          
          ${getTaxesInvoices(items, Currency)}
          ${
            note === 'CreditNote'
              ? `<cac:LegalMonetaryTotal>
                <!--Grupo de campos para información relacionadas con los valores totales aplicables a la factura [1..1]-->
                <cbc:LineExtensionAmount currencyID="${Currency}">${LineExtensionAmount}</cbc:LineExtensionAmount>
                <cbc:TaxExclusiveAmount currencyID="${Currency}">${TaxExclusiveAmount}</cbc:TaxExclusiveAmount>
                <cbc:TaxInclusiveAmount currencyID="${Currency}">${TaxInclusiveAmount}</cbc:TaxInclusiveAmount>
                <cbc:PayableAmount currencyID="${Currency}">${PayableAmount}</cbc:PayableAmount>
                </cac:LegalMonetaryTotal>`
              : `
              <cac:RequestedMonetaryTotal>
            <!--Grupo de campos para información relacionadas con los valores totales aplicables a la factura [1..1]-->
            <cbc:LineExtensionAmount currencyID="${Currency}">${LineExtensionAmount}</cbc:LineExtensionAmount>
            <cbc:TaxExclusiveAmount currencyID="${Currency}">${TaxExclusiveAmount}</cbc:TaxExclusiveAmount>
            <cbc:TaxInclusiveAmount currencyID="${Currency}">${TaxInclusiveAmount}</cbc:TaxInclusiveAmount>
            <cbc:PayableAmount currencyID="${Currency}">${PayableAmount}</cbc:PayableAmount>
          </cac:RequestedMonetaryTotal>
              `
          }
  
          ${invoiceLine({
            items,
            Currency,
            lineName: note,
            CustomerNIT,
            operation,
          })}
          <DATA>
            <UBL21>true</UBL21>
            <Partnership>
              <ID>901441896</ID>
              <!--Identificación de la Alianza [1..1] -->
              <TechKey>${ClTec}</TechKey>
              <!--Clave Técnica [1..1]-->
             ${
               ProfileExecutionID === 2
                 ? `<SetTestID>${SetTestID}</SetTestID>`
                 : '\n'
             }
              <!-- Test ID Sólo Aplica para pruebas [1..1] -->
            </Partnership>
          </DATA>
        </${note}>`,
  };
};
export { invoiceGen, noteGen };
