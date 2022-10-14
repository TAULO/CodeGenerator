(function(factory) {
  if (typeof define === 'function' && define.amd) {
    // AMD. Register as an anonymous module.
    define(['./ApiClient', './model/AccountInfo', './model/AccountLimits', './model/AddonInfo', './model/AnsweringRuleInfo', './model/AnsweringRuleInfoCalleeInfo', './model/AnsweringRuleInfoCallerInfo', './model/AttachmentInfo', './model/BillingPlanInfo', './model/BlockedNumberInfo', './model/Body', './model/Body1', './model/Body2', './model/Body3', './model/Body4', './model/Body5', './model/Body6', './model/Body7', './model/Body8', './model/Body9', './model/BrandInfo', './model/BusinessAddressInfo', './model/BusinessHourScheduleInfo', './model/CallLogInfo', './model/CallLogRecord', './model/CallerInfo', './model/ConferencingInfo', './model/ConferencingInfoPhoneNumberInfo', './model/ConferencingInfoPhoneNumberInfoCountryInfo', './model/ConferencingRequestPhoneNumber', './model/ContactAddressInfo', './model/ContactInfo', './model/CountryInfo', './model/DeliveryMode', './model/DepartmentInfo', './model/DepartmentResponseExtensionInfo', './model/DeviceInfo', './model/DeviceInfoExtensionInfo', './model/EmergencyAddressInfo', './model/ExtensionInfo', './model/ExtensionInfoRequestContactInfo', './model/ExtensionInfoRequestContactInfoRegionalSettings', './model/ExtensionInfoRequestContactInfoRegionalSettingsFormattingLocale', './model/ExtensionInfoRequestContactInfoRegionalSettingsGreetingLanguage', './model/ExtensionInfoRequestContactInfoRegionalSettingsLanguage', './model/ExtensionInfoRequestContactInfoRegionalSettingsTimezone', './model/ExtensionInfoRequestPartnerId', './model/ExtensionInfoRequestPasswordPIN', './model/ExtensionInfoRequestProvision', './model/ExtensionInfoRequestProvisionContactInfo', './model/ExtensionInfoRequestStatusInfo', './model/ExtensionPermissions', './model/ExtensionServiceFeatureInfo', './model/FormattingLocaleInfo', './model/ForwardingInfo', './model/ForwardingNumberInfo', './model/FullCountryInfo', './model/GrantInfo', './model/GrantInfoExtensionInfo', './model/GreetingLanguageInfo', './model/GroupInfo', './model/InlineResponseDefault', './model/InlineResponseDefault1', './model/InlineResponseDefault10', './model/InlineResponseDefault11', './model/InlineResponseDefault12', './model/InlineResponseDefault13', './model/InlineResponseDefault14', './model/InlineResponseDefault2', './model/InlineResponseDefault3', './model/InlineResponseDefault4', './model/InlineResponseDefault5', './model/InlineResponseDefault6', './model/InlineResponseDefault7', './model/InlineResponseDefault8', './model/InlineResponseDefault9', './model/LanguageInfo', './model/LegInfo', './model/LegInfoExtensionInfo', './model/LocationInfo', './model/LookUpPhoneNumberPhoneNumberInfo', './model/MessageAttachmentInfo', './model/MessageInfo', './model/MessageInfoCallerInfo', './model/ModelInfo', './model/NavigationInfo', './model/PagingInfo', './model/ParsePhoneNumberCountryInfo', './model/ParsePhoneNumberPhoneNumberInfo', './model/PermissionInfo', './model/PersonalContactInfo', './model/PhoneLinesInfo', './model/PhoneLinesInfoPhoneNumberInfo', './model/PhoneNumberInfo', './model/PhoneNumberInfoExtensionInfo', './model/PresenceInfo', './model/PresenceInfoExtensionInfo', './model/ProfileImageInfo', './model/RangesInfo', './model/RecipientInfo', './model/RecordingInfo', './model/ReferenceInfo', './model/RegionalSettings', './model/ReservePhoneNumberRequestReserveRecord', './model/ReservePhoneNumberResponseReserveRecord', './model/RingOutInfo', './model/RingOutRequestCountryInfo', './model/RingOutRequestFrom', './model/RingOutRequestTo', './model/RingOutStatusInfo', './model/RuleInfo', './model/RuleInfoForwardingNumberInfo', './model/ScheduleInfo', './model/ServerInfo', './model/ServiceFeatureInfo', './model/ServiceInfo', './model/ServicePlanInfo', './model/ShippingAddress', './model/ShippingInfo', './model/ShippingMethod', './model/StateInfo', './model/StateInfoCountryInfo', './model/StatusInfo', './model/SubscriptionInfo', './model/SubscriptionRequestDeliveryMode', './model/SyncInfo', './model/TargetServicePlanInfo', './model/TimeInterval', './model/TimezoneInfo', './model/UnconditionalForwardingInfo', './model/VersionInfo', './model/VoicemailInfo', './model/WeeklyScheduleInfo', './api/DefaultApi'], factory);
  } else if (typeof module === 'object' && module.exports) {
    // CommonJS-like environments that support module.exports, like Node.
    module.exports = factory(require('./ApiClient'), require('./model/AccountInfo'), require('./model/AccountLimits'), require('./model/AddonInfo'), require('./model/AnsweringRuleInfo'), require('./model/AnsweringRuleInfoCalleeInfo'), require('./model/AnsweringRuleInfoCallerInfo'), require('./model/AttachmentInfo'), require('./model/BillingPlanInfo'), require('./model/BlockedNumberInfo'), require('./model/Body'), require('./model/Body1'), require('./model/Body2'), require('./model/Body3'), require('./model/Body4'), require('./model/Body5'), require('./model/Body6'), require('./model/Body7'), require('./model/Body8'), require('./model/Body9'), require('./model/BrandInfo'), require('./model/BusinessAddressInfo'), require('./model/BusinessHourScheduleInfo'), require('./model/CallLogInfo'), require('./model/CallLogRecord'), require('./model/CallerInfo'), require('./model/ConferencingInfo'), require('./model/ConferencingInfoPhoneNumberInfo'), require('./model/ConferencingInfoPhoneNumberInfoCountryInfo'), require('./model/ConferencingRequestPhoneNumber'), require('./model/ContactAddressInfo'), require('./model/ContactInfo'), require('./model/CountryInfo'), require('./model/DeliveryMode'), require('./model/DepartmentInfo'), require('./model/DepartmentResponseExtensionInfo'), require('./model/DeviceInfo'), require('./model/DeviceInfoExtensionInfo'), require('./model/EmergencyAddressInfo'), require('./model/ExtensionInfo'), require('./model/ExtensionInfoRequestContactInfo'), require('./model/ExtensionInfoRequestContactInfoRegionalSettings'), require('./model/ExtensionInfoRequestContactInfoRegionalSettingsFormattingLocale'), require('./model/ExtensionInfoRequestContactInfoRegionalSettingsGreetingLanguage'), require('./model/ExtensionInfoRequestContactInfoRegionalSettingsLanguage'), require('./model/ExtensionInfoRequestContactInfoRegionalSettingsTimezone'), require('./model/ExtensionInfoRequestPartnerId'), require('./model/ExtensionInfoRequestPasswordPIN'), require('./model/ExtensionInfoRequestProvision'), require('./model/ExtensionInfoRequestProvisionContactInfo'), require('./model/ExtensionInfoRequestStatusInfo'), require('./model/ExtensionPermissions'), require('./model/ExtensionServiceFeatureInfo'), require('./model/FormattingLocaleInfo'), require('./model/ForwardingInfo'), require('./model/ForwardingNumberInfo'), require('./model/FullCountryInfo'), require('./model/GrantInfo'), require('./model/GrantInfoExtensionInfo'), require('./model/GreetingLanguageInfo'), require('./model/GroupInfo'), require('./model/InlineResponseDefault'), require('./model/InlineResponseDefault1'), require('./model/InlineResponseDefault10'), require('./model/InlineResponseDefault11'), require('./model/InlineResponseDefault12'), require('./model/InlineResponseDefault13'), require('./model/InlineResponseDefault14'), require('./model/InlineResponseDefault2'), require('./model/InlineResponseDefault3'), require('./model/InlineResponseDefault4'), require('./model/InlineResponseDefault5'), require('./model/InlineResponseDefault6'), require('./model/InlineResponseDefault7'), require('./model/InlineResponseDefault8'), require('./model/InlineResponseDefault9'), require('./model/LanguageInfo'), require('./model/LegInfo'), require('./model/LegInfoExtensionInfo'), require('./model/LocationInfo'), require('./model/LookUpPhoneNumberPhoneNumberInfo'), require('./model/MessageAttachmentInfo'), require('./model/MessageInfo'), require('./model/MessageInfoCallerInfo'), require('./model/ModelInfo'), require('./model/NavigationInfo'), require('./model/PagingInfo'), require('./model/ParsePhoneNumberCountryInfo'), require('./model/ParsePhoneNumberPhoneNumberInfo'), require('./model/PermissionInfo'), require('./model/PersonalContactInfo'), require('./model/PhoneLinesInfo'), require('./model/PhoneLinesInfoPhoneNumberInfo'), require('./model/PhoneNumberInfo'), require('./model/PhoneNumberInfoExtensionInfo'), require('./model/PresenceInfo'), require('./model/PresenceInfoExtensionInfo'), require('./model/ProfileImageInfo'), require('./model/RangesInfo'), require('./model/RecipientInfo'), require('./model/RecordingInfo'), require('./model/ReferenceInfo'), require('./model/RegionalSettings'), require('./model/ReservePhoneNumberRequestReserveRecord'), require('./model/ReservePhoneNumberResponseReserveRecord'), require('./model/RingOutInfo'), require('./model/RingOutRequestCountryInfo'), require('./model/RingOutRequestFrom'), require('./model/RingOutRequestTo'), require('./model/RingOutStatusInfo'), require('./model/RuleInfo'), require('./model/RuleInfoForwardingNumberInfo'), require('./model/ScheduleInfo'), require('./model/ServerInfo'), require('./model/ServiceFeatureInfo'), require('./model/ServiceInfo'), require('./model/ServicePlanInfo'), require('./model/ShippingAddress'), require('./model/ShippingInfo'), require('./model/ShippingMethod'), require('./model/StateInfo'), require('./model/StateInfoCountryInfo'), require('./model/StatusInfo'), require('./model/SubscriptionInfo'), require('./model/SubscriptionRequestDeliveryMode'), require('./model/SyncInfo'), require('./model/TargetServicePlanInfo'), require('./model/TimeInterval'), require('./model/TimezoneInfo'), require('./model/UnconditionalForwardingInfo'), require('./model/VersionInfo'), require('./model/VoicemailInfo'), require('./model/WeeklyScheduleInfo'), require('./api/DefaultApi'));
  }
}(function(ApiClient, AccountInfo, AccountLimits, AddonInfo, AnsweringRuleInfo, AnsweringRuleInfoCalleeInfo, AnsweringRuleInfoCallerInfo, AttachmentInfo, BillingPlanInfo, BlockedNumberInfo, Body, Body1, Body2, Body3, Body4, Body5, Body6, Body7, Body8, Body9, BrandInfo, BusinessAddressInfo, BusinessHourScheduleInfo, CallLogInfo, CallLogRecord, CallerInfo, ConferencingInfo, ConferencingInfoPhoneNumberInfo, ConferencingInfoPhoneNumberInfoCountryInfo, ConferencingRequestPhoneNumber, ContactAddressInfo, ContactInfo, CountryInfo, DeliveryMode, DepartmentInfo, DepartmentResponseExtensionInfo, DeviceInfo, DeviceInfoExtensionInfo, EmergencyAddressInfo, ExtensionInfo, ExtensionInfoRequestContactInfo, ExtensionInfoRequestContactInfoRegionalSettings, ExtensionInfoRequestContactInfoRegionalSettingsFormattingLocale, ExtensionInfoRequestContactInfoRegionalSettingsGreetingLanguage, ExtensionInfoRequestContactInfoRegionalSettingsLanguage, ExtensionInfoRequestContactInfoRegionalSettingsTimezone, ExtensionInfoRequestPartnerId, ExtensionInfoRequestPasswordPIN, ExtensionInfoRequestProvision, ExtensionInfoRequestProvisionContactInfo, ExtensionInfoRequestStatusInfo, ExtensionPermissions, ExtensionServiceFeatureInfo, FormattingLocaleInfo, ForwardingInfo, ForwardingNumberInfo, FullCountryInfo, GrantInfo, GrantInfoExtensionInfo, GreetingLanguageInfo, GroupInfo, InlineResponseDefault, InlineResponseDefault1, InlineResponseDefault10, InlineResponseDefault11, InlineResponseDefault12, InlineResponseDefault13, InlineResponseDefault14, InlineResponseDefault2, InlineResponseDefault3, InlineResponseDefault4, InlineResponseDefault5, InlineResponseDefault6, InlineResponseDefault7, InlineResponseDefault8, InlineResponseDefault9, LanguageInfo, LegInfo, LegInfoExtensionInfo, LocationInfo, LookUpPhoneNumberPhoneNumberInfo, MessageAttachmentInfo, MessageInfo, MessageInfoCallerInfo, ModelInfo, NavigationInfo, PagingInfo, ParsePhoneNumberCountryInfo, ParsePhoneNumberPhoneNumberInfo, PermissionInfo, PersonalContactInfo, PhoneLinesInfo, PhoneLinesInfoPhoneNumberInfo, PhoneNumberInfo, PhoneNumberInfoExtensionInfo, PresenceInfo, PresenceInfoExtensionInfo, ProfileImageInfo, RangesInfo, RecipientInfo, RecordingInfo, ReferenceInfo, RegionalSettings, ReservePhoneNumberRequestReserveRecord, ReservePhoneNumberResponseReserveRecord, RingOutInfo, RingOutRequestCountryInfo, RingOutRequestFrom, RingOutRequestTo, RingOutStatusInfo, RuleInfo, RuleInfoForwardingNumberInfo, ScheduleInfo, ServerInfo, ServiceFeatureInfo, ServiceInfo, ServicePlanInfo, ShippingAddress, ShippingInfo, ShippingMethod, StateInfo, StateInfoCountryInfo, StatusInfo, SubscriptionInfo, SubscriptionRequestDeliveryMode, SyncInfo, TargetServicePlanInfo, TimeInterval, TimezoneInfo, UnconditionalForwardingInfo, VersionInfo, VoicemailInfo, WeeklyScheduleInfo, DefaultApi) {
  'use strict';

  /**
   * RingCentral Connect Platform API.<br>
   * The <code>index</code> module provides access to constructors for all the classes which comprise the public API.
   * <p>
   * An AMD (recommended!) or CommonJS application will generally do something equivalent to the following:
   * <pre>
   * var RingCentralApi = require('./index'); // See note below*.
   * var xxxSvc = new RingCentralApi.XxxApi(); // Allocate the API class we're going to use.
   * var yyyModel = new RingCentralApi.Yyy(); // Construct a model instance.
   * yyyModel.someProperty = 'someValue';
   * ...
   * var zzz = xxxSvc.doSomething(yyyModel); // Invoke the service.
   * ...
   * </pre>
   * <em>*NOTE: For a top-level AMD script, use require(['./index'], function(){...}) and put the application logic within the
   * callback function.</em>
   * </p>
   * <p>
   * A non-AMD browser application (discouraged) might do something like this:
   * <pre>
   * var xxxSvc = new RingCentralApi.XxxApi(); // Allocate the API class we're going to use.
   * var yyy = new RingCentralApi.Yyy(); // Construct a model instance.
   * yyyModel.someProperty = 'someValue';
   * ...
   * var zzz = xxxSvc.doSomething(yyyModel); // Invoke the service.
   * ...
   * </pre>
   * </p>
   * @module index
   * @version v1.0
   */
  var exports = {
    /**
     * The ApiClient constructor.
     * @property {module:ApiClient}
     */
    ApiClient: ApiClient,
    /**
     * The AccountInfo model constructor.
     * @property {module:model/AccountInfo}
     */
    AccountInfo: AccountInfo,
    /**
     * The AccountLimits model constructor.
     * @property {module:model/AccountLimits}
     */
    AccountLimits: AccountLimits,
    /**
     * The AddonInfo model constructor.
     * @property {module:model/AddonInfo}
     */
    AddonInfo: AddonInfo,
    /**
     * The AnsweringRuleInfo model constructor.
     * @property {module:model/AnsweringRuleInfo}
     */
    AnsweringRuleInfo: AnsweringRuleInfo,
    /**
     * The AnsweringRuleInfoCalleeInfo model constructor.
     * @property {module:model/AnsweringRuleInfoCalleeInfo}
     */
    AnsweringRuleInfoCalleeInfo: AnsweringRuleInfoCalleeInfo,
    /**
     * The AnsweringRuleInfoCallerInfo model constructor.
     * @property {module:model/AnsweringRuleInfoCallerInfo}
     */
    AnsweringRuleInfoCallerInfo: AnsweringRuleInfoCallerInfo,
    /**
     * The AttachmentInfo model constructor.
     * @property {module:model/AttachmentInfo}
     */
    AttachmentInfo: AttachmentInfo,
    /**
     * The BillingPlanInfo model constructor.
     * @property {module:model/BillingPlanInfo}
     */
    BillingPlanInfo: BillingPlanInfo,
    /**
     * The BlockedNumberInfo model constructor.
     * @property {module:model/BlockedNumberInfo}
     */
    BlockedNumberInfo: BlockedNumberInfo,
    /**
     * The Body model constructor.
     * @property {module:model/Body}
     */
    Body: Body,
    /**
     * The Body1 model constructor.
     * @property {module:model/Body1}
     */
    Body1: Body1,
    /**
     * The Body2 model constructor.
     * @property {module:model/Body2}
     */
    Body2: Body2,
    /**
     * The Body3 model constructor.
     * @property {module:model/Body3}
     */
    Body3: Body3,
    /**
     * The Body4 model constructor.
     * @property {module:model/Body4}
     */
    Body4: Body4,
    /**
     * The Body5 model constructor.
     * @property {module:model/Body5}
     */
    Body5: Body5,
    /**
     * The Body6 model constructor.
     * @property {module:model/Body6}
     */
    Body6: Body6,
    /**
     * The Body7 model constructor.
     * @property {module:model/Body7}
     */
    Body7: Body7,
    /**
     * The Body8 model constructor.
     * @property {module:model/Body8}
     */
    Body8: Body8,
    /**
     * The Body9 model constructor.
     * @property {module:model/Body9}
     */
    Body9: Body9,
    /**
     * The BrandInfo model constructor.
     * @property {module:model/BrandInfo}
     */
    BrandInfo: BrandInfo,
    /**
     * The BusinessAddressInfo model constructor.
     * @property {module:model/BusinessAddressInfo}
     */
    BusinessAddressInfo: BusinessAddressInfo,
    /**
     * The BusinessHourScheduleInfo model constructor.
     * @property {module:model/BusinessHourScheduleInfo}
     */
    BusinessHourScheduleInfo: BusinessHourScheduleInfo,
    /**
     * The CallLogInfo model constructor.
     * @property {module:model/CallLogInfo}
     */
    CallLogInfo: CallLogInfo,
    /**
     * The CallLogRecord model constructor.
     * @property {module:model/CallLogRecord}
     */
    CallLogRecord: CallLogRecord,
    /**
     * The CallerInfo model constructor.
     * @property {module:model/CallerInfo}
     */
    CallerInfo: CallerInfo,
    /**
     * The ConferencingInfo model constructor.
     * @property {module:model/ConferencingInfo}
     */
    ConferencingInfo: ConferencingInfo,
    /**
     * The ConferencingInfoPhoneNumberInfo model constructor.
     * @property {module:model/ConferencingInfoPhoneNumberInfo}
     */
    ConferencingInfoPhoneNumberInfo: ConferencingInfoPhoneNumberInfo,
    /**
     * The ConferencingInfoPhoneNumberInfoCountryInfo model constructor.
     * @property {module:model/ConferencingInfoPhoneNumberInfoCountryInfo}
     */
    ConferencingInfoPhoneNumberInfoCountryInfo: ConferencingInfoPhoneNumberInfoCountryInfo,
    /**
     * The ConferencingRequestPhoneNumber model constructor.
     * @property {module:model/ConferencingRequestPhoneNumber}
     */
    ConferencingRequestPhoneNumber: ConferencingRequestPhoneNumber,
    /**
     * The ContactAddressInfo model constructor.
     * @property {module:model/ContactAddressInfo}
     */
    ContactAddressInfo: ContactAddressInfo,
    /**
     * The ContactInfo model constructor.
     * @property {module:model/ContactInfo}
     */
    ContactInfo: ContactInfo,
    /**
     * The CountryInfo model constructor.
     * @property {module:model/CountryInfo}
     */
    CountryInfo: CountryInfo,
    /**
     * The DeliveryMode model constructor.
     * @property {module:model/DeliveryMode}
     */
    DeliveryMode: DeliveryMode,
    /**
     * The DepartmentInfo model constructor.
     * @property {module:model/DepartmentInfo}
     */
    DepartmentInfo: DepartmentInfo,
    /**
     * The DepartmentResponseExtensionInfo model constructor.
     * @property {module:model/DepartmentResponseExtensionInfo}
     */
    DepartmentResponseExtensionInfo: DepartmentResponseExtensionInfo,
    /**
     * The DeviceInfo model constructor.
     * @property {module:model/DeviceInfo}
     */
    DeviceInfo: DeviceInfo,
    /**
     * The DeviceInfoExtensionInfo model constructor.
     * @property {module:model/DeviceInfoExtensionInfo}
     */
    DeviceInfoExtensionInfo: DeviceInfoExtensionInfo,
    /**
     * The EmergencyAddressInfo model constructor.
     * @property {module:model/EmergencyAddressInfo}
     */
    EmergencyAddressInfo: EmergencyAddressInfo,
    /**
     * The ExtensionInfo model constructor.
     * @property {module:model/ExtensionInfo}
     */
    ExtensionInfo: ExtensionInfo,
    /**
     * The ExtensionInfoRequestContactInfo model constructor.
     * @property {module:model/ExtensionInfoRequestContactInfo}
     */
    ExtensionInfoRequestContactInfo: ExtensionInfoRequestContactInfo,
    /**
     * The ExtensionInfoRequestContactInfoRegionalSettings model constructor.
     * @property {module:model/ExtensionInfoRequestContactInfoRegionalSettings}
     */
    ExtensionInfoRequestContactInfoRegionalSettings: ExtensionInfoRequestContactInfoRegionalSettings,
    /**
     * The ExtensionInfoRequestContactInfoRegionalSettingsFormattingLocale model constructor.
     * @property {module:model/ExtensionInfoRequestContactInfoRegionalSettingsFormattingLocale}
     */
    ExtensionInfoRequestContactInfoRegionalSettingsFormattingLocale: ExtensionInfoRequestContactInfoRegionalSettingsFormattingLocale,
    /**
     * The ExtensionInfoRequestContactInfoRegionalSettingsGreetingLanguage model constructor.
     * @property {module:model/ExtensionInfoRequestContactInfoRegionalSettingsGreetingLanguage}
     */
    ExtensionInfoRequestContactInfoRegionalSettingsGreetingLanguage: ExtensionInfoRequestContactInfoRegionalSettingsGreetingLanguage,
    /**
     * The ExtensionInfoRequestContactInfoRegionalSettingsLanguage model constructor.
     * @property {module:model/ExtensionInfoRequestContactInfoRegionalSettingsLanguage}
     */
    ExtensionInfoRequestContactInfoRegionalSettingsLanguage: ExtensionInfoRequestContactInfoRegionalSettingsLanguage,
    /**
     * The ExtensionInfoRequestContactInfoRegionalSettingsTimezone model constructor.
     * @property {module:model/ExtensionInfoRequestContactInfoRegionalSettingsTimezone}
     */
    ExtensionInfoRequestContactInfoRegionalSettingsTimezone: ExtensionInfoRequestContactInfoRegionalSettingsTimezone,
    /**
     * The ExtensionInfoRequestPartnerId model constructor.
     * @property {module:model/ExtensionInfoRequestPartnerId}
     */
    ExtensionInfoRequestPartnerId: ExtensionInfoRequestPartnerId,
    /**
     * The ExtensionInfoRequestPasswordPIN model constructor.
     * @property {module:model/ExtensionInfoRequestPasswordPIN}
     */
    ExtensionInfoRequestPasswordPIN: ExtensionInfoRequestPasswordPIN,
    /**
     * The ExtensionInfoRequestProvision model constructor.
     * @property {module:model/ExtensionInfoRequestProvision}
     */
    ExtensionInfoRequestProvision: ExtensionInfoRequestProvision,
    /**
     * The ExtensionInfoRequestProvisionContactInfo model constructor.
     * @property {module:model/ExtensionInfoRequestProvisionContactInfo}
     */
    ExtensionInfoRequestProvisionContactInfo: ExtensionInfoRequestProvisionContactInfo,
    /**
     * The ExtensionInfoRequestStatusInfo model constructor.
     * @property {module:model/ExtensionInfoRequestStatusInfo}
     */
    ExtensionInfoRequestStatusInfo: ExtensionInfoRequestStatusInfo,
    /**
     * The ExtensionPermissions model constructor.
     * @property {module:model/ExtensionPermissions}
     */
    ExtensionPermissions: ExtensionPermissions,
    /**
     * The ExtensionServiceFeatureInfo model constructor.
     * @property {module:model/ExtensionServiceFeatureInfo}
     */
    ExtensionServiceFeatureInfo: ExtensionServiceFeatureInfo,
    /**
     * The FormattingLocaleInfo model constructor.
     * @property {module:model/FormattingLocaleInfo}
     */
    FormattingLocaleInfo: FormattingLocaleInfo,
    /**
     * The ForwardingInfo model constructor.
     * @property {module:model/ForwardingInfo}
     */
    ForwardingInfo: ForwardingInfo,
    /**
     * The ForwardingNumberInfo model constructor.
     * @property {module:model/ForwardingNumberInfo}
     */
    ForwardingNumberInfo: ForwardingNumberInfo,
    /**
     * The FullCountryInfo model constructor.
     * @property {module:model/FullCountryInfo}
     */
    FullCountryInfo: FullCountryInfo,
    /**
     * The GrantInfo model constructor.
     * @property {module:model/GrantInfo}
     */
    GrantInfo: GrantInfo,
    /**
     * The GrantInfoExtensionInfo model constructor.
     * @property {module:model/GrantInfoExtensionInfo}
     */
    GrantInfoExtensionInfo: GrantInfoExtensionInfo,
    /**
     * The GreetingLanguageInfo model constructor.
     * @property {module:model/GreetingLanguageInfo}
     */
    GreetingLanguageInfo: GreetingLanguageInfo,
    /**
     * The GroupInfo model constructor.
     * @property {module:model/GroupInfo}
     */
    GroupInfo: GroupInfo,
    /**
     * The InlineResponseDefault model constructor.
     * @property {module:model/InlineResponseDefault}
     */
    InlineResponseDefault: InlineResponseDefault,
    /**
     * The InlineResponseDefault1 model constructor.
     * @property {module:model/InlineResponseDefault1}
     */
    InlineResponseDefault1: InlineResponseDefault1,
    /**
     * The InlineResponseDefault10 model constructor.
     * @property {module:model/InlineResponseDefault10}
     */
    InlineResponseDefault10: InlineResponseDefault10,
    /**
     * The InlineResponseDefault11 model constructor.
     * @property {module:model/InlineResponseDefault11}
     */
    InlineResponseDefault11: InlineResponseDefault11,
    /**
     * The InlineResponseDefault12 model constructor.
     * @property {module:model/InlineResponseDefault12}
     */
    InlineResponseDefault12: InlineResponseDefault12,
    /**
     * The InlineResponseDefault13 model constructor.
     * @property {module:model/InlineResponseDefault13}
     */
    InlineResponseDefault13: InlineResponseDefault13,
    /**
     * The InlineResponseDefault14 model constructor.
     * @property {module:model/InlineResponseDefault14}
     */
    InlineResponseDefault14: InlineResponseDefault14,
    /**
     * The InlineResponseDefault2 model constructor.
     * @property {module:model/InlineResponseDefault2}
     */
    InlineResponseDefault2: InlineResponseDefault2,
    /**
     * The InlineResponseDefault3 model constructor.
     * @property {module:model/InlineResponseDefault3}
     */
    InlineResponseDefault3: InlineResponseDefault3,
    /**
     * The InlineResponseDefault4 model constructor.
     * @property {module:model/InlineResponseDefault4}
     */
    InlineResponseDefault4: InlineResponseDefault4,
    /**
     * The InlineResponseDefault5 model constructor.
     * @property {module:model/InlineResponseDefault5}
     */
    InlineResponseDefault5: InlineResponseDefault5,
    /**
     * The InlineResponseDefault6 model constructor.
     * @property {module:model/InlineResponseDefault6}
     */
    InlineResponseDefault6: InlineResponseDefault6,
    /**
     * The InlineResponseDefault7 model constructor.
     * @property {module:model/InlineResponseDefault7}
     */
    InlineResponseDefault7: InlineResponseDefault7,
    /**
     * The InlineResponseDefault8 model constructor.
     * @property {module:model/InlineResponseDefault8}
     */
    InlineResponseDefault8: InlineResponseDefault8,
    /**
     * The InlineResponseDefault9 model constructor.
     * @property {module:model/InlineResponseDefault9}
     */
    InlineResponseDefault9: InlineResponseDefault9,
    /**
     * The LanguageInfo model constructor.
     * @property {module:model/LanguageInfo}
     */
    LanguageInfo: LanguageInfo,
    /**
     * The LegInfo model constructor.
     * @property {module:model/LegInfo}
     */
    LegInfo: LegInfo,
    /**
     * The LegInfoExtensionInfo model constructor.
     * @property {module:model/LegInfoExtensionInfo}
     */
    LegInfoExtensionInfo: LegInfoExtensionInfo,
    /**
     * The LocationInfo model constructor.
     * @property {module:model/LocationInfo}
     */
    LocationInfo: LocationInfo,
    /**
     * The LookUpPhoneNumberPhoneNumberInfo model constructor.
     * @property {module:model/LookUpPhoneNumberPhoneNumberInfo}
     */
    LookUpPhoneNumberPhoneNumberInfo: LookUpPhoneNumberPhoneNumberInfo,
    /**
     * The MessageAttachmentInfo model constructor.
     * @property {module:model/MessageAttachmentInfo}
     */
    MessageAttachmentInfo: MessageAttachmentInfo,
    /**
     * The MessageInfo model constructor.
     * @property {module:model/MessageInfo}
     */
    MessageInfo: MessageInfo,
    /**
     * The MessageInfoCallerInfo model constructor.
     * @property {module:model/MessageInfoCallerInfo}
     */
    MessageInfoCallerInfo: MessageInfoCallerInfo,
    /**
     * The ModelInfo model constructor.
     * @property {module:model/ModelInfo}
     */
    ModelInfo: ModelInfo,
    /**
     * The NavigationInfo model constructor.
     * @property {module:model/NavigationInfo}
     */
    NavigationInfo: NavigationInfo,
    /**
     * The PagingInfo model constructor.
     * @property {module:model/PagingInfo}
     */
    PagingInfo: PagingInfo,
    /**
     * The ParsePhoneNumberCountryInfo model constructor.
     * @property {module:model/ParsePhoneNumberCountryInfo}
     */
    ParsePhoneNumberCountryInfo: ParsePhoneNumberCountryInfo,
    /**
     * The ParsePhoneNumberPhoneNumberInfo model constructor.
     * @property {module:model/ParsePhoneNumberPhoneNumberInfo}
     */
    ParsePhoneNumberPhoneNumberInfo: ParsePhoneNumberPhoneNumberInfo,
    /**
     * The PermissionInfo model constructor.
     * @property {module:model/PermissionInfo}
     */
    PermissionInfo: PermissionInfo,
    /**
     * The PersonalContactInfo model constructor.
     * @property {module:model/PersonalContactInfo}
     */
    PersonalContactInfo: PersonalContactInfo,
    /**
     * The PhoneLinesInfo model constructor.
     * @property {module:model/PhoneLinesInfo}
     */
    PhoneLinesInfo: PhoneLinesInfo,
    /**
     * The PhoneLinesInfoPhoneNumberInfo model constructor.
     * @property {module:model/PhoneLinesInfoPhoneNumberInfo}
     */
    PhoneLinesInfoPhoneNumberInfo: PhoneLinesInfoPhoneNumberInfo,
    /**
     * The PhoneNumberInfo model constructor.
     * @property {module:model/PhoneNumberInfo}
     */
    PhoneNumberInfo: PhoneNumberInfo,
    /**
     * The PhoneNumberInfoExtensionInfo model constructor.
     * @property {module:model/PhoneNumberInfoExtensionInfo}
     */
    PhoneNumberInfoExtensionInfo: PhoneNumberInfoExtensionInfo,
    /**
     * The PresenceInfo model constructor.
     * @property {module:model/PresenceInfo}
     */
    PresenceInfo: PresenceInfo,
    /**
     * The PresenceInfoExtensionInfo model constructor.
     * @property {module:model/PresenceInfoExtensionInfo}
     */
    PresenceInfoExtensionInfo: PresenceInfoExtensionInfo,
    /**
     * The ProfileImageInfo model constructor.
     * @property {module:model/ProfileImageInfo}
     */
    ProfileImageInfo: ProfileImageInfo,
    /**
     * The RangesInfo model constructor.
     * @property {module:model/RangesInfo}
     */
    RangesInfo: RangesInfo,
    /**
     * The RecipientInfo model constructor.
     * @property {module:model/RecipientInfo}
     */
    RecipientInfo: RecipientInfo,
    /**
     * The RecordingInfo model constructor.
     * @property {module:model/RecordingInfo}
     */
    RecordingInfo: RecordingInfo,
    /**
     * The ReferenceInfo model constructor.
     * @property {module:model/ReferenceInfo}
     */
    ReferenceInfo: ReferenceInfo,
    /**
     * The RegionalSettings model constructor.
     * @property {module:model/RegionalSettings}
     */
    RegionalSettings: RegionalSettings,
    /**
     * The ReservePhoneNumberRequestReserveRecord model constructor.
     * @property {module:model/ReservePhoneNumberRequestReserveRecord}
     */
    ReservePhoneNumberRequestReserveRecord: ReservePhoneNumberRequestReserveRecord,
    /**
     * The ReservePhoneNumberResponseReserveRecord model constructor.
     * @property {module:model/ReservePhoneNumberResponseReserveRecord}
     */
    ReservePhoneNumberResponseReserveRecord: ReservePhoneNumberResponseReserveRecord,
    /**
     * The RingOutInfo model constructor.
     * @property {module:model/RingOutInfo}
     */
    RingOutInfo: RingOutInfo,
    /**
     * The RingOutRequestCountryInfo model constructor.
     * @property {module:model/RingOutRequestCountryInfo}
     */
    RingOutRequestCountryInfo: RingOutRequestCountryInfo,
    /**
     * The RingOutRequestFrom model constructor.
     * @property {module:model/RingOutRequestFrom}
     */
    RingOutRequestFrom: RingOutRequestFrom,
    /**
     * The RingOutRequestTo model constructor.
     * @property {module:model/RingOutRequestTo}
     */
    RingOutRequestTo: RingOutRequestTo,
    /**
     * The RingOutStatusInfo model constructor.
     * @property {module:model/RingOutStatusInfo}
     */
    RingOutStatusInfo: RingOutStatusInfo,
    /**
     * The RuleInfo model constructor.
     * @property {module:model/RuleInfo}
     */
    RuleInfo: RuleInfo,
    /**
     * The RuleInfoForwardingNumberInfo model constructor.
     * @property {module:model/RuleInfoForwardingNumberInfo}
     */
    RuleInfoForwardingNumberInfo: RuleInfoForwardingNumberInfo,
    /**
     * The ScheduleInfo model constructor.
     * @property {module:model/ScheduleInfo}
     */
    ScheduleInfo: ScheduleInfo,
    /**
     * The ServerInfo model constructor.
     * @property {module:model/ServerInfo}
     */
    ServerInfo: ServerInfo,
    /**
     * The ServiceFeatureInfo model constructor.
     * @property {module:model/ServiceFeatureInfo}
     */
    ServiceFeatureInfo: ServiceFeatureInfo,
    /**
     * The ServiceInfo model constructor.
     * @property {module:model/ServiceInfo}
     */
    ServiceInfo: ServiceInfo,
    /**
     * The ServicePlanInfo model constructor.
     * @property {module:model/ServicePlanInfo}
     */
    ServicePlanInfo: ServicePlanInfo,
    /**
     * The ShippingAddress model constructor.
     * @property {module:model/ShippingAddress}
     */
    ShippingAddress: ShippingAddress,
    /**
     * The ShippingInfo model constructor.
     * @property {module:model/ShippingInfo}
     */
    ShippingInfo: ShippingInfo,
    /**
     * The ShippingMethod model constructor.
     * @property {module:model/ShippingMethod}
     */
    ShippingMethod: ShippingMethod,
    /**
     * The StateInfo model constructor.
     * @property {module:model/StateInfo}
     */
    StateInfo: StateInfo,
    /**
     * The StateInfoCountryInfo model constructor.
     * @property {module:model/StateInfoCountryInfo}
     */
    StateInfoCountryInfo: StateInfoCountryInfo,
    /**
     * The StatusInfo model constructor.
     * @property {module:model/StatusInfo}
     */
    StatusInfo: StatusInfo,
    /**
     * The SubscriptionInfo model constructor.
     * @property {module:model/SubscriptionInfo}
     */
    SubscriptionInfo: SubscriptionInfo,
    /**
     * The SubscriptionRequestDeliveryMode model constructor.
     * @property {module:model/SubscriptionRequestDeliveryMode}
     */
    SubscriptionRequestDeliveryMode: SubscriptionRequestDeliveryMode,
    /**
     * The SyncInfo model constructor.
     * @property {module:model/SyncInfo}
     */
    SyncInfo: SyncInfo,
    /**
     * The TargetServicePlanInfo model constructor.
     * @property {module:model/TargetServicePlanInfo}
     */
    TargetServicePlanInfo: TargetServicePlanInfo,
    /**
     * The TimeInterval model constructor.
     * @property {module:model/TimeInterval}
     */
    TimeInterval: TimeInterval,
    /**
     * The TimezoneInfo model constructor.
     * @property {module:model/TimezoneInfo}
     */
    TimezoneInfo: TimezoneInfo,
    /**
     * The UnconditionalForwardingInfo model constructor.
     * @property {module:model/UnconditionalForwardingInfo}
     */
    UnconditionalForwardingInfo: UnconditionalForwardingInfo,
    /**
     * The VersionInfo model constructor.
     * @property {module:model/VersionInfo}
     */
    VersionInfo: VersionInfo,
    /**
     * The VoicemailInfo model constructor.
     * @property {module:model/VoicemailInfo}
     */
    VoicemailInfo: VoicemailInfo,
    /**
     * The WeeklyScheduleInfo model constructor.
     * @property {module:model/WeeklyScheduleInfo}
     */
    WeeklyScheduleInfo: WeeklyScheduleInfo,
    /**
     * The DefaultApi service constructor.
     * @property {module:api/DefaultApi}
     */
    DefaultApi: DefaultApi
  };

  return exports;
}));
