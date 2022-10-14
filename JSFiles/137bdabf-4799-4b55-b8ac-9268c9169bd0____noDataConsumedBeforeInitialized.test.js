import BpmnModdle from 'bpmn-moddle';
import { noDataConsumedBeforeInitialized } from './noDataConsumedBeforeInitialized';
import { v1 as pbModdle } from 'pflegebrille-workflow-meta-model';

const testRule = require('bpmnlint/lib/test-rule');

async function lintModel(xml) {
  const bpmnModdle = new BpmnModdle({ pb: pbModdle });
  const model = await bpmnModdle.fromXML(xml);
  const rule = noDataConsumedBeforeInitialized().factory();
  return testRule({ moddleRoot: model.rootElement, rule });
}

describe('check test graphs', () => {
  it('used in cycle correctly', async () => {
    const xml = `<?xml version="1.0" encoding="UTF-8"?>
        <bpmn:definitions xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:bpmn="http://www.omg.org/spec/BPMN/20100524/MODEL" xmlns:bpmndi="http://www.omg.org/spec/BPMN/20100524/DI" xmlns:pb="http://pflegebrille.de/schema/bpmn/pb-extension/v1.0.0" xmlns:di="http://www.omg.org/spec/DD/20100524/DI" xmlns:dc="http://www.omg.org/spec/DD/20100524/DC" xmlns:bioc="http://bpmn.io/schema/bpmn/biocolor/1.0" id="Definitions" targetNamespace="http://bpmn.io/schema/bpmn" exporter="pflegebrille-workflow-modeler" exporterVersion="1.0.1 (debug)" xsi:schemaLocation="http://www.omg.org/spec/BPMN/20100524/MODEL BPMN20.xsd">
          <bpmn:extensionElements>
            <pb:assets />
            <pb:data>
              <pb:datum id="Datum_1x8r6cq" name="Patient" type="Patient" isCollection="false" />
              <pb:datum id="Datum_1ipybm4" name="Wunde" type="Wound" isCollection="false" />
            </pb:data>
          </bpmn:extensionElements>
          <bpmn:process id="Process" isExecutable="true">
            <bpmn:startEvent id="Event_0kbyusg" name="Start">
              <bpmn:outgoing>Flow_1tgv2zq</bpmn:outgoing>
            </bpmn:startEvent>
            <bpmn:userTask id="Activity_0rgx31a" name="Patient scannen/wählen">
              <bpmn:extensionElements>
                <pb:userTaskExtension>
                  <pb:patientSelect patientOutput="Datum_1x8r6cq" />
                </pb:userTaskExtension>
              </bpmn:extensionElements>
              <bpmn:incoming>Flow_0ljex1v</bpmn:incoming>
              <bpmn:outgoing>Flow_107c80s</bpmn:outgoing>
            </bpmn:userTask>
            <bpmn:userTask id="Activity_18pw5b0" name="Bestehende Wunde auswählen">
              <bpmn:extensionElements>
                <pb:userTaskExtension>
                  <pb:woundSelect patientInput="Datum_1x8r6cq" woundOutput="Datum_1ipybm4" />
                </pb:userTaskExtension>
              </bpmn:extensionElements>
              <bpmn:incoming>Flow_0h54cg0</bpmn:incoming>
              <bpmn:outgoing>Flow_0prqj6e</bpmn:outgoing>
            </bpmn:userTask>
            <bpmn:exclusiveGateway id="Gateway_1wv4yfy">
              <bpmn:incoming>Flow_0prqj6e</bpmn:incoming>
              <bpmn:outgoing>Flow_1ri2anq</bpmn:outgoing>
            </bpmn:exclusiveGateway>
            <bpmn:sequenceFlow id="Flow_0prqj6e" sourceRef="Activity_18pw5b0" targetRef="Gateway_1wv4yfy" />
            <bpmn:exclusiveGateway id="Gateway_0oyspnr">
              <bpmn:incoming>Flow_1ri2anq</bpmn:incoming>
              <bpmn:incoming>Flow_107c80s</bpmn:incoming>
              <bpmn:outgoing>Flow_0h54cg0</bpmn:outgoing>
            </bpmn:exclusiveGateway>
            <bpmn:sequenceFlow id="Flow_1ri2anq" sourceRef="Gateway_1wv4yfy" targetRef="Gateway_0oyspnr" />
            <bpmn:sequenceFlow id="Flow_107c80s" sourceRef="Activity_0rgx31a" targetRef="Gateway_0oyspnr" />
            <bpmn:sequenceFlow id="Flow_0h54cg0" sourceRef="Gateway_0oyspnr" targetRef="Activity_18pw5b0" />
            <bpmn:exclusiveGateway id="Gateway_06tppos">
              <bpmn:incoming>Flow_1tgv2zq</bpmn:incoming>
              <bpmn:outgoing>Flow_0ljex1v</bpmn:outgoing>
            </bpmn:exclusiveGateway>
            <bpmn:sequenceFlow id="Flow_1tgv2zq" sourceRef="Event_0kbyusg" targetRef="Gateway_06tppos" />
            <bpmn:sequenceFlow id="Flow_0ljex1v" sourceRef="Gateway_06tppos" targetRef="Activity_0rgx31a" />
          </bpmn:process>
          <bpmndi:BPMNDiagram id="BPMNDiagram_1">
            <bpmndi:BPMNPlane id="BPMNPlane_1" bpmnElement="Process">
              <bpmndi:BPMNEdge id="Flow_0ljex1v_di" bpmnElement="Flow_0ljex1v">
                <di:waypoint x="455" y="293" />
                <di:waypoint x="590" y="293" />
              </bpmndi:BPMNEdge>
              <bpmndi:BPMNEdge id="Flow_1tgv2zq_di" bpmnElement="Flow_1tgv2zq">
                <di:waypoint x="288" y="293" />
                <di:waypoint x="405" y="293" />
              </bpmndi:BPMNEdge>
              <bpmndi:BPMNEdge id="Flow_0h54cg0_di" bpmnElement="Flow_0h54cg0">
                <di:waypoint x="880" y="435" />
                <di:waypoint x="880" y="293" />
                <di:waypoint x="990" y="293" />
              </bpmndi:BPMNEdge>
              <bpmndi:BPMNEdge id="Flow_107c80s_di" bpmnElement="Flow_107c80s">
                <di:waypoint x="640" y="333" />
                <di:waypoint x="640" y="460" />
                <di:waypoint x="855" y="460" />
              </bpmndi:BPMNEdge>
              <bpmndi:BPMNEdge id="Flow_1ri2anq_di" bpmnElement="Flow_1ri2anq">
                <di:waypoint x="1145" y="460" />
                <di:waypoint x="905" y="460" />
              </bpmndi:BPMNEdge>
              <bpmndi:BPMNEdge id="Flow_0prqj6e_di" bpmnElement="Flow_0prqj6e">
                <di:waypoint x="1090" y="293" />
                <di:waypoint x="1170" y="293" />
                <di:waypoint x="1170" y="435" />
              </bpmndi:BPMNEdge>
              <bpmndi:BPMNShape id="Event_0kbyusg_di" bpmnElement="Event_0kbyusg">
                <dc:Bounds x="252" y="275" width="36" height="36" />
                <bpmndi:BPMNLabel>
                  <dc:Bounds x="259" y="318" width="24" height="14" />
                </bpmndi:BPMNLabel>
              </bpmndi:BPMNShape>
              <bpmndi:BPMNShape id="Activity_0rgx31a_di" bpmnElement="Activity_0rgx31a" bioc:stroke="#1978ff" bioc:fill="#ebebf9">
                <dc:Bounds x="590" y="253" width="100" height="80" />
              </bpmndi:BPMNShape>
              <bpmndi:BPMNShape id="Activity_18pw5b0_di" bpmnElement="Activity_18pw5b0" bioc:stroke="#1978ff" bioc:fill="#ebebf9">
                <dc:Bounds x="990" y="253" width="100" height="80" />
              </bpmndi:BPMNShape>
              <bpmndi:BPMNShape id="Gateway_1wv4yfy_di" bpmnElement="Gateway_1wv4yfy" isMarkerVisible="true">
                <dc:Bounds x="1145" y="435" width="50" height="50" />
              </bpmndi:BPMNShape>
              <bpmndi:BPMNShape id="Gateway_0oyspnr_di" bpmnElement="Gateway_0oyspnr" isMarkerVisible="true">
                <dc:Bounds x="855" y="435" width="50" height="50" />
              </bpmndi:BPMNShape>
              <bpmndi:BPMNShape id="Gateway_06tppos_di" bpmnElement="Gateway_06tppos" isMarkerVisible="true">
                <dc:Bounds x="405" y="268" width="50" height="50" />
              </bpmndi:BPMNShape>
            </bpmndi:BPMNPlane>
          </bpmndi:BPMNDiagram>
        </bpmn:definitions>
        `;
    const msg = await lintModel(xml);
    expect(msg).toHaveLength(0);
  });

  it('used wrongly in cycle with bypass', async () => {
    const xml = `<?xml version="1.0" encoding="UTF-8"?>
        <bpmn:definitions xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:bpmn="http://www.omg.org/spec/BPMN/20100524/MODEL" xmlns:bpmndi="http://www.omg.org/spec/BPMN/20100524/DI" xmlns:pb="http://pflegebrille.de/schema/bpmn/pb-extension/v1.0.0" xmlns:di="http://www.omg.org/spec/DD/20100524/DI" xmlns:dc="http://www.omg.org/spec/DD/20100524/DC" xmlns:bioc="http://bpmn.io/schema/bpmn/biocolor/1.0" id="Definitions" targetNamespace="http://bpmn.io/schema/bpmn" exporter="pflegebrille-workflow-modeler" exporterVersion="1.0.1 (debug)" xsi:schemaLocation="http://www.omg.org/spec/BPMN/20100524/MODEL BPMN20.xsd">
          <bpmn:extensionElements>
            <pb:assets />
            <pb:data>
              <pb:datum id="Datum_1x8r6cq" name="Patient" type="Patient" isCollection="false" />
              <pb:datum id="Datum_1ipybm4" name="Wunde" type="Wound" isCollection="false" />
            </pb:data>
          </bpmn:extensionElements>
          <bpmn:process id="Process" isExecutable="true">
            <bpmn:startEvent id="Event_0kbyusg" name="Start">
              <bpmn:outgoing>Flow_1tgv2zq</bpmn:outgoing>
            </bpmn:startEvent>
            <bpmn:userTask id="Activity_0rgx31a" name="Patient scannen/wählen">
              <bpmn:extensionElements>
                <pb:userTaskExtension>
                  <pb:patientSelect patientOutput="Datum_1x8r6cq" />
                </pb:userTaskExtension>
              </bpmn:extensionElements>
              <bpmn:incoming>Flow_0ljex1v</bpmn:incoming>
              <bpmn:outgoing>Flow_107c80s</bpmn:outgoing>
            </bpmn:userTask>
            <bpmn:userTask id="Activity_18pw5b0" name="Bestehende Wunde auswählen">
              <bpmn:extensionElements>
                <pb:userTaskExtension>
                  <pb:woundSelect patientInput="Datum_1x8r6cq" woundOutput="Datum_1ipybm4" />
                </pb:userTaskExtension>
              </bpmn:extensionElements>
              <bpmn:incoming>Flow_0h54cg0</bpmn:incoming>
              <bpmn:outgoing>Flow_0prqj6e</bpmn:outgoing>
            </bpmn:userTask>
            <bpmn:exclusiveGateway id="Gateway_1wv4yfy">
              <bpmn:incoming>Flow_0prqj6e</bpmn:incoming>
              <bpmn:incoming>Flow_0n8r002</bpmn:incoming>
              <bpmn:outgoing>Flow_1ri2anq</bpmn:outgoing>
            </bpmn:exclusiveGateway>
            <bpmn:sequenceFlow id="Flow_0prqj6e" sourceRef="Activity_18pw5b0" targetRef="Gateway_1wv4yfy" />
            <bpmn:exclusiveGateway id="Gateway_0oyspnr">
              <bpmn:incoming>Flow_1ri2anq</bpmn:incoming>
              <bpmn:incoming>Flow_107c80s</bpmn:incoming>
              <bpmn:outgoing>Flow_0h54cg0</bpmn:outgoing>
            </bpmn:exclusiveGateway>
            <bpmn:sequenceFlow id="Flow_1ri2anq" sourceRef="Gateway_1wv4yfy" targetRef="Gateway_0oyspnr" />
            <bpmn:sequenceFlow id="Flow_107c80s" sourceRef="Activity_0rgx31a" targetRef="Gateway_0oyspnr" />
            <bpmn:sequenceFlow id="Flow_0h54cg0" sourceRef="Gateway_0oyspnr" targetRef="Activity_18pw5b0" />
            <bpmn:exclusiveGateway id="Gateway_06tppos">
              <bpmn:incoming>Flow_1tgv2zq</bpmn:incoming>
              <bpmn:outgoing>Flow_0ljex1v</bpmn:outgoing>
              <bpmn:outgoing>Flow_0n8r002</bpmn:outgoing>
            </bpmn:exclusiveGateway>
            <bpmn:sequenceFlow id="Flow_1tgv2zq" sourceRef="Event_0kbyusg" targetRef="Gateway_06tppos" />
            <bpmn:sequenceFlow id="Flow_0ljex1v" sourceRef="Gateway_06tppos" targetRef="Activity_0rgx31a" />
            <bpmn:sequenceFlow id="Flow_0n8r002" sourceRef="Gateway_06tppos" targetRef="Gateway_1wv4yfy" />
          </bpmn:process>
          <bpmndi:BPMNDiagram id="BPMNDiagram_1">
            <bpmndi:BPMNPlane id="BPMNPlane_1" bpmnElement="Process">
              <bpmndi:BPMNEdge id="Flow_0ljex1v_di" bpmnElement="Flow_0ljex1v">
                <di:waypoint x="455" y="293" />
                <di:waypoint x="590" y="293" />
              </bpmndi:BPMNEdge>
              <bpmndi:BPMNEdge id="Flow_1tgv2zq_di" bpmnElement="Flow_1tgv2zq">
                <di:waypoint x="288" y="293" />
                <di:waypoint x="405" y="293" />
              </bpmndi:BPMNEdge>
              <bpmndi:BPMNEdge id="Flow_0h54cg0_di" bpmnElement="Flow_0h54cg0">
                <di:waypoint x="880" y="435" />
                <di:waypoint x="880" y="293" />
                <di:waypoint x="990" y="293" />
              </bpmndi:BPMNEdge>
              <bpmndi:BPMNEdge id="Flow_107c80s_di" bpmnElement="Flow_107c80s">
                <di:waypoint x="640" y="333" />
                <di:waypoint x="640" y="460" />
                <di:waypoint x="855" y="460" />
              </bpmndi:BPMNEdge>
              <bpmndi:BPMNEdge id="Flow_1ri2anq_di" bpmnElement="Flow_1ri2anq">
                <di:waypoint x="1145" y="460" />
                <di:waypoint x="905" y="460" />
              </bpmndi:BPMNEdge>
              <bpmndi:BPMNEdge id="Flow_0prqj6e_di" bpmnElement="Flow_0prqj6e">
                <di:waypoint x="1090" y="293" />
                <di:waypoint x="1170" y="293" />
                <di:waypoint x="1170" y="435" />
              </bpmndi:BPMNEdge>
              <bpmndi:BPMNEdge id="Flow_0n8r002_di" bpmnElement="Flow_0n8r002">
                <di:waypoint x="430" y="318" />
                <di:waypoint x="430" y="650" />
                <di:waypoint x="1170" y="650" />
                <di:waypoint x="1170" y="485" />
              </bpmndi:BPMNEdge>
              <bpmndi:BPMNShape id="Event_0kbyusg_di" bpmnElement="Event_0kbyusg">
                <dc:Bounds x="252" y="275" width="36" height="36" />
                <bpmndi:BPMNLabel>
                  <dc:Bounds x="259" y="318" width="24" height="14" />
                </bpmndi:BPMNLabel>
              </bpmndi:BPMNShape>
              <bpmndi:BPMNShape id="Activity_0rgx31a_di" bpmnElement="Activity_0rgx31a" bioc:stroke="#1978ff" bioc:fill="#ebebf9">
                <dc:Bounds x="590" y="253" width="100" height="80" />
              </bpmndi:BPMNShape>
              <bpmndi:BPMNShape id="Activity_18pw5b0_di" bpmnElement="Activity_18pw5b0" bioc:stroke="#1978ff" bioc:fill="#ebebf9">
                <dc:Bounds x="990" y="253" width="100" height="80" />
              </bpmndi:BPMNShape>
              <bpmndi:BPMNShape id="Gateway_1wv4yfy_di" bpmnElement="Gateway_1wv4yfy" isMarkerVisible="true">
                <dc:Bounds x="1145" y="435" width="50" height="50" />
              </bpmndi:BPMNShape>
              <bpmndi:BPMNShape id="Gateway_0oyspnr_di" bpmnElement="Gateway_0oyspnr" isMarkerVisible="true">
                <dc:Bounds x="855" y="435" width="50" height="50" />
              </bpmndi:BPMNShape>
              <bpmndi:BPMNShape id="Gateway_06tppos_di" bpmnElement="Gateway_06tppos" isMarkerVisible="true">
                <dc:Bounds x="405" y="268" width="50" height="50" />
              </bpmndi:BPMNShape>
            </bpmndi:BPMNPlane>
          </bpmndi:BPMNDiagram>
        </bpmn:definitions>
        `;
    const msg = await lintModel(xml);
    expect(msg).toHaveLength(1);
  });

  it('used wrongly after cycle double bypass', async () => {
    const xml = `<?xml version="1.0" encoding="UTF-8"?>
        <bpmn:definitions xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:bpmn="http://www.omg.org/spec/BPMN/20100524/MODEL" xmlns:bpmndi="http://www.omg.org/spec/BPMN/20100524/DI" xmlns:pb="http://pflegebrille.de/schema/bpmn/pb-extension/v1.0.0" xmlns:di="http://www.omg.org/spec/DD/20100524/DI" xmlns:dc="http://www.omg.org/spec/DD/20100524/DC" xmlns:bioc="http://bpmn.io/schema/bpmn/biocolor/1.0" id="Definitions" targetNamespace="http://bpmn.io/schema/bpmn" exporter="pflegebrille-workflow-modeler" exporterVersion="1.0.1 (debug)" xsi:schemaLocation="http://www.omg.org/spec/BPMN/20100524/MODEL BPMN20.xsd">
          <bpmn:extensionElements>
            <pb:assets />
            <pb:data>
              <pb:datum id="Datum_1x8r6cq" name="Patient" type="Patient" isCollection="false" />
              <pb:datum id="Datum_1ipybm4" name="Wunde" type="Wound" isCollection="false" />
            </pb:data>
          </bpmn:extensionElements>
          <bpmn:process id="Process" isExecutable="true">
            <bpmn:startEvent id="Event_0kbyusg" name="Start">
              <bpmn:outgoing>Flow_1tgv2zq</bpmn:outgoing>
            </bpmn:startEvent>
            <bpmn:userTask id="Activity_0rgx31a" name="Patient scannen/wählen">
              <bpmn:extensionElements>
                <pb:userTaskExtension>
                  <pb:patientSelect patientOutput="Datum_1x8r6cq" />
                </pb:userTaskExtension>
              </bpmn:extensionElements>
              <bpmn:incoming>Flow_0ljex1v</bpmn:incoming>
              <bpmn:outgoing>Flow_107c80s</bpmn:outgoing>
            </bpmn:userTask>
            <bpmn:userTask id="Activity_18pw5b0" name="Bestehende Wunde auswählen">
              <bpmn:extensionElements>
                <pb:userTaskExtension>
                  <pb:woundSelect patientInput="Datum_1x8r6cq" woundOutput="Datum_1ipybm4" />
                </pb:userTaskExtension>
              </bpmn:extensionElements>
              <bpmn:incoming>Flow_0h54cg0</bpmn:incoming>
              <bpmn:outgoing>Flow_0prqj6e</bpmn:outgoing>
            </bpmn:userTask>
            <bpmn:exclusiveGateway id="Gateway_1wv4yfy">
              <bpmn:incoming>Flow_0prqj6e</bpmn:incoming>
              <bpmn:incoming>Flow_1clnesj</bpmn:incoming>
              <bpmn:incoming>Flow_0n8r002</bpmn:incoming>
              <bpmn:outgoing>Flow_1ri2anq</bpmn:outgoing>
              <bpmn:outgoing>Flow_1vsonvb</bpmn:outgoing>
            </bpmn:exclusiveGateway>
            <bpmn:sequenceFlow id="Flow_0prqj6e" sourceRef="Activity_18pw5b0" targetRef="Gateway_1wv4yfy" />
            <bpmn:exclusiveGateway id="Gateway_0oyspnr">
              <bpmn:incoming>Flow_1ri2anq</bpmn:incoming>
              <bpmn:incoming>Flow_107c80s</bpmn:incoming>
              <bpmn:outgoing>Flow_0h54cg0</bpmn:outgoing>
              <bpmn:outgoing>Flow_1clnesj</bpmn:outgoing>
            </bpmn:exclusiveGateway>
            <bpmn:sequenceFlow id="Flow_1ri2anq" sourceRef="Gateway_1wv4yfy" targetRef="Gateway_0oyspnr" />
            <bpmn:sequenceFlow id="Flow_107c80s" sourceRef="Activity_0rgx31a" targetRef="Gateway_0oyspnr" />
            <bpmn:sequenceFlow id="Flow_0h54cg0" sourceRef="Gateway_0oyspnr" targetRef="Activity_18pw5b0" />
            <bpmn:exclusiveGateway id="Gateway_06tppos">
              <bpmn:incoming>Flow_1tgv2zq</bpmn:incoming>
              <bpmn:outgoing>Flow_0ljex1v</bpmn:outgoing>
              <bpmn:outgoing>Flow_0n8r002</bpmn:outgoing>
            </bpmn:exclusiveGateway>
            <bpmn:sequenceFlow id="Flow_1tgv2zq" sourceRef="Event_0kbyusg" targetRef="Gateway_06tppos" />
            <bpmn:sequenceFlow id="Flow_0ljex1v" sourceRef="Gateway_06tppos" targetRef="Activity_0rgx31a" />
            <bpmn:serviceTask id="Activity_19ch8gp">
              <bpmn:extensionElements>
                <pb:serviceTaskExtension>
                  <pb:concatData firstInput="Datum_1ipybm4" />
                </pb:serviceTaskExtension>
              </bpmn:extensionElements>
              <bpmn:incoming>Flow_1vsonvb</bpmn:incoming>
            </bpmn:serviceTask>
            <bpmn:sequenceFlow id="Flow_1vsonvb" sourceRef="Gateway_1wv4yfy" targetRef="Activity_19ch8gp" />
            <bpmn:sequenceFlow id="Flow_1clnesj" sourceRef="Gateway_0oyspnr" targetRef="Gateway_1wv4yfy" />
            <bpmn:sequenceFlow id="Flow_0n8r002" sourceRef="Gateway_06tppos" targetRef="Gateway_1wv4yfy" />
          </bpmn:process>
          <bpmndi:BPMNDiagram id="BPMNDiagram_1">
            <bpmndi:BPMNPlane id="BPMNPlane_1" bpmnElement="Process">
              <bpmndi:BPMNEdge id="Flow_0n8r002_di" bpmnElement="Flow_0n8r002">
                <di:waypoint x="430" y="318" />
                <di:waypoint x="430" y="650" />
                <di:waypoint x="1170" y="650" />
                <di:waypoint x="1170" y="485" />
              </bpmndi:BPMNEdge>
              <bpmndi:BPMNEdge id="Flow_0ljex1v_di" bpmnElement="Flow_0ljex1v">
                <di:waypoint x="455" y="293" />
                <di:waypoint x="590" y="293" />
              </bpmndi:BPMNEdge>
              <bpmndi:BPMNEdge id="Flow_1tgv2zq_di" bpmnElement="Flow_1tgv2zq">
                <di:waypoint x="288" y="293" />
                <di:waypoint x="405" y="293" />
              </bpmndi:BPMNEdge>
              <bpmndi:BPMNEdge id="Flow_0h54cg0_di" bpmnElement="Flow_0h54cg0">
                <di:waypoint x="880" y="435" />
                <di:waypoint x="880" y="293" />
                <di:waypoint x="990" y="293" />
              </bpmndi:BPMNEdge>
              <bpmndi:BPMNEdge id="Flow_107c80s_di" bpmnElement="Flow_107c80s">
                <di:waypoint x="640" y="333" />
                <di:waypoint x="640" y="460" />
                <di:waypoint x="855" y="460" />
              </bpmndi:BPMNEdge>
              <bpmndi:BPMNEdge id="Flow_1ri2anq_di" bpmnElement="Flow_1ri2anq">
                <di:waypoint x="1145" y="460" />
                <di:waypoint x="905" y="460" />
              </bpmndi:BPMNEdge>
              <bpmndi:BPMNEdge id="Flow_0prqj6e_di" bpmnElement="Flow_0prqj6e">
                <di:waypoint x="1090" y="293" />
                <di:waypoint x="1170" y="293" />
                <di:waypoint x="1170" y="435" />
              </bpmndi:BPMNEdge>
              <bpmndi:BPMNEdge id="Flow_1vsonvb_di" bpmnElement="Flow_1vsonvb">
                <di:waypoint x="1195" y="460" />
                <di:waypoint x="1250" y="460" />
              </bpmndi:BPMNEdge>
              <bpmndi:BPMNEdge id="Flow_1clnesj_di" bpmnElement="Flow_1clnesj">
                <di:waypoint x="894" y="471" />
                <di:waypoint x="960" y="520" />
                <di:waypoint x="1080" y="520" />
                <di:waypoint x="1155" y="470" />
              </bpmndi:BPMNEdge>
              <bpmndi:BPMNShape id="Event_0kbyusg_di" bpmnElement="Event_0kbyusg">
                <dc:Bounds x="252" y="275" width="36" height="36" />
                <bpmndi:BPMNLabel>
                  <dc:Bounds x="259" y="318" width="24" height="14" />
                </bpmndi:BPMNLabel>
              </bpmndi:BPMNShape>
              <bpmndi:BPMNShape id="Activity_0rgx31a_di" bpmnElement="Activity_0rgx31a" bioc:stroke="#1978ff" bioc:fill="#ebebf9">
                <dc:Bounds x="590" y="253" width="100" height="80" />
              </bpmndi:BPMNShape>
              <bpmndi:BPMNShape id="Activity_18pw5b0_di" bpmnElement="Activity_18pw5b0" bioc:stroke="#1978ff" bioc:fill="#ebebf9">
                <dc:Bounds x="990" y="253" width="100" height="80" />
              </bpmndi:BPMNShape>
              <bpmndi:BPMNShape id="Gateway_1wv4yfy_di" bpmnElement="Gateway_1wv4yfy" isMarkerVisible="true">
                <dc:Bounds x="1145" y="435" width="50" height="50" />
              </bpmndi:BPMNShape>
              <bpmndi:BPMNShape id="Gateway_0oyspnr_di" bpmnElement="Gateway_0oyspnr" isMarkerVisible="true">
                <dc:Bounds x="855" y="435" width="50" height="50" />
              </bpmndi:BPMNShape>
              <bpmndi:BPMNShape id="Gateway_06tppos_di" bpmnElement="Gateway_06tppos" isMarkerVisible="true">
                <dc:Bounds x="405" y="268" width="50" height="50" />
              </bpmndi:BPMNShape>
              <bpmndi:BPMNShape id="Activity_19ch8gp_di" bpmnElement="Activity_19ch8gp" bioc:stroke="#ae3f3f" bioc:fill="#f6ebeb">
                <dc:Bounds x="1250" y="420" width="100" height="80" />
              </bpmndi:BPMNShape>
            </bpmndi:BPMNPlane>
          </bpmndi:BPMNDiagram>
        </bpmn:definitions>
        `;
    const msg = await lintModel(xml);
    expect(msg).toHaveLength(2);
  });

  it('used wrongly after cycle with single bypass', async () => {
    const xml = `<?xml version="1.0" encoding="UTF-8"?>
        <bpmn:definitions xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:bpmn="http://www.omg.org/spec/BPMN/20100524/MODEL" xmlns:bpmndi="http://www.omg.org/spec/BPMN/20100524/DI" xmlns:pb="http://pflegebrille.de/schema/bpmn/pb-extension/v1.0.0" xmlns:di="http://www.omg.org/spec/DD/20100524/DI" xmlns:dc="http://www.omg.org/spec/DD/20100524/DC" xmlns:bioc="http://bpmn.io/schema/bpmn/biocolor/1.0" id="Definitions" targetNamespace="http://bpmn.io/schema/bpmn" exporter="pflegebrille-workflow-modeler" exporterVersion="1.0.1 (debug)" xsi:schemaLocation="http://www.omg.org/spec/BPMN/20100524/MODEL BPMN20.xsd">
          <bpmn:extensionElements>
            <pb:assets />
            <pb:data>
              <pb:datum id="Datum_1x8r6cq" name="Patient" type="Patient" isCollection="false" />
              <pb:datum id="Datum_1ipybm4" name="Wunde" type="Wound" isCollection="false" />
            </pb:data>
          </bpmn:extensionElements>
          <bpmn:process id="Process" isExecutable="true">
            <bpmn:startEvent id="Event_0kbyusg" name="Start">
              <bpmn:outgoing>Flow_1tgv2zq</bpmn:outgoing>
            </bpmn:startEvent>
            <bpmn:userTask id="Activity_0rgx31a" name="Patient scannen/wählen">
              <bpmn:extensionElements>
                <pb:userTaskExtension>
                  <pb:patientSelect patientOutput="Datum_1x8r6cq" />
                </pb:userTaskExtension>
              </bpmn:extensionElements>
              <bpmn:incoming>Flow_0ljex1v</bpmn:incoming>
              <bpmn:outgoing>Flow_107c80s</bpmn:outgoing>
            </bpmn:userTask>
            <bpmn:userTask id="Activity_18pw5b0" name="Bestehende Wunde auswählen">
              <bpmn:extensionElements>
                <pb:userTaskExtension>
                  <pb:woundSelect patientInput="Datum_1x8r6cq" woundOutput="Datum_1ipybm4" />
                </pb:userTaskExtension>
              </bpmn:extensionElements>
              <bpmn:incoming>Flow_0h54cg0</bpmn:incoming>
              <bpmn:outgoing>Flow_0prqj6e</bpmn:outgoing>
            </bpmn:userTask>
            <bpmn:exclusiveGateway id="Gateway_1wv4yfy">
              <bpmn:incoming>Flow_0prqj6e</bpmn:incoming>
              <bpmn:incoming>Flow_1clnesj</bpmn:incoming>
              <bpmn:outgoing>Flow_1ri2anq</bpmn:outgoing>
              <bpmn:outgoing>Flow_1vsonvb</bpmn:outgoing>
            </bpmn:exclusiveGateway>
            <bpmn:sequenceFlow id="Flow_0prqj6e" sourceRef="Activity_18pw5b0" targetRef="Gateway_1wv4yfy" />
            <bpmn:exclusiveGateway id="Gateway_0oyspnr">
              <bpmn:incoming>Flow_1ri2anq</bpmn:incoming>
              <bpmn:incoming>Flow_107c80s</bpmn:incoming>
              <bpmn:outgoing>Flow_0h54cg0</bpmn:outgoing>
              <bpmn:outgoing>Flow_1clnesj</bpmn:outgoing>
            </bpmn:exclusiveGateway>
            <bpmn:sequenceFlow id="Flow_1ri2anq" sourceRef="Gateway_1wv4yfy" targetRef="Gateway_0oyspnr" />
            <bpmn:sequenceFlow id="Flow_107c80s" sourceRef="Activity_0rgx31a" targetRef="Gateway_0oyspnr" />
            <bpmn:sequenceFlow id="Flow_0h54cg0" sourceRef="Gateway_0oyspnr" targetRef="Activity_18pw5b0" />
            <bpmn:exclusiveGateway id="Gateway_06tppos">
              <bpmn:incoming>Flow_1tgv2zq</bpmn:incoming>
              <bpmn:outgoing>Flow_0ljex1v</bpmn:outgoing>
            </bpmn:exclusiveGateway>
            <bpmn:sequenceFlow id="Flow_1tgv2zq" sourceRef="Event_0kbyusg" targetRef="Gateway_06tppos" />
            <bpmn:sequenceFlow id="Flow_0ljex1v" sourceRef="Gateway_06tppos" targetRef="Activity_0rgx31a" />
            <bpmn:serviceTask id="Activity_19ch8gp">
              <bpmn:extensionElements>
                <pb:serviceTaskExtension>
                  <pb:concatData firstInput="Datum_1ipybm4" />
                </pb:serviceTaskExtension>
              </bpmn:extensionElements>
              <bpmn:incoming>Flow_1vsonvb</bpmn:incoming>
            </bpmn:serviceTask>
            <bpmn:sequenceFlow id="Flow_1vsonvb" sourceRef="Gateway_1wv4yfy" targetRef="Activity_19ch8gp" />
            <bpmn:sequenceFlow id="Flow_1clnesj" sourceRef="Gateway_0oyspnr" targetRef="Gateway_1wv4yfy" />
          </bpmn:process>
          <bpmndi:BPMNDiagram id="BPMNDiagram_1">
            <bpmndi:BPMNPlane id="BPMNPlane_1" bpmnElement="Process">
              <bpmndi:BPMNEdge id="Flow_1clnesj_di" bpmnElement="Flow_1clnesj">
                <di:waypoint x="894" y="471" />
                <di:waypoint x="960" y="520" />
                <di:waypoint x="1080" y="520" />
                <di:waypoint x="1155" y="470" />
              </bpmndi:BPMNEdge>
              <bpmndi:BPMNEdge id="Flow_1vsonvb_di" bpmnElement="Flow_1vsonvb">
                <di:waypoint x="1195" y="460" />
                <di:waypoint x="1250" y="460" />
              </bpmndi:BPMNEdge>
              <bpmndi:BPMNEdge id="Flow_0ljex1v_di" bpmnElement="Flow_0ljex1v">
                <di:waypoint x="455" y="293" />
                <di:waypoint x="590" y="293" />
              </bpmndi:BPMNEdge>
              <bpmndi:BPMNEdge id="Flow_1tgv2zq_di" bpmnElement="Flow_1tgv2zq">
                <di:waypoint x="288" y="293" />
                <di:waypoint x="405" y="293" />
              </bpmndi:BPMNEdge>
              <bpmndi:BPMNEdge id="Flow_0h54cg0_di" bpmnElement="Flow_0h54cg0">
                <di:waypoint x="880" y="435" />
                <di:waypoint x="880" y="293" />
                <di:waypoint x="990" y="293" />
              </bpmndi:BPMNEdge>
              <bpmndi:BPMNEdge id="Flow_107c80s_di" bpmnElement="Flow_107c80s">
                <di:waypoint x="640" y="333" />
                <di:waypoint x="640" y="460" />
                <di:waypoint x="855" y="460" />
              </bpmndi:BPMNEdge>
              <bpmndi:BPMNEdge id="Flow_1ri2anq_di" bpmnElement="Flow_1ri2anq">
                <di:waypoint x="1145" y="460" />
                <di:waypoint x="905" y="460" />
              </bpmndi:BPMNEdge>
              <bpmndi:BPMNEdge id="Flow_0prqj6e_di" bpmnElement="Flow_0prqj6e">
                <di:waypoint x="1090" y="293" />
                <di:waypoint x="1170" y="293" />
                <di:waypoint x="1170" y="435" />
              </bpmndi:BPMNEdge>
              <bpmndi:BPMNShape id="Event_0kbyusg_di" bpmnElement="Event_0kbyusg">
                <dc:Bounds x="252" y="275" width="36" height="36" />
                <bpmndi:BPMNLabel>
                  <dc:Bounds x="259" y="318" width="24" height="14" />
                </bpmndi:BPMNLabel>
              </bpmndi:BPMNShape>
              <bpmndi:BPMNShape id="Activity_0rgx31a_di" bpmnElement="Activity_0rgx31a" bioc:stroke="#1978ff" bioc:fill="#ebebf9">
                <dc:Bounds x="590" y="253" width="100" height="80" />
              </bpmndi:BPMNShape>
              <bpmndi:BPMNShape id="Activity_18pw5b0_di" bpmnElement="Activity_18pw5b0" bioc:stroke="#1978ff" bioc:fill="#ebebf9">
                <dc:Bounds x="990" y="253" width="100" height="80" />
              </bpmndi:BPMNShape>
              <bpmndi:BPMNShape id="Gateway_1wv4yfy_di" bpmnElement="Gateway_1wv4yfy" isMarkerVisible="true">
                <dc:Bounds x="1145" y="435" width="50" height="50" />
              </bpmndi:BPMNShape>
              <bpmndi:BPMNShape id="Gateway_0oyspnr_di" bpmnElement="Gateway_0oyspnr" isMarkerVisible="true">
                <dc:Bounds x="855" y="435" width="50" height="50" />
              </bpmndi:BPMNShape>
              <bpmndi:BPMNShape id="Gateway_06tppos_di" bpmnElement="Gateway_06tppos" isMarkerVisible="true">
                <dc:Bounds x="405" y="268" width="50" height="50" />
              </bpmndi:BPMNShape>
              <bpmndi:BPMNShape id="Activity_19ch8gp_di" bpmnElement="Activity_19ch8gp" bioc:stroke="#ae3f3f" bioc:fill="#f6ebeb">
                <dc:Bounds x="1250" y="420" width="100" height="80" />
              </bpmndi:BPMNShape>
            </bpmndi:BPMNPlane>
          </bpmndi:BPMNDiagram>
        </bpmn:definitions>
        `;
    const msg = await lintModel(xml);
    expect(msg).toHaveLength(1);
  });

  it('used after cycle correctly', async () => {
    const xml = `<?xml version="1.0" encoding="UTF-8"?>
        <bpmn:definitions xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:bpmn="http://www.omg.org/spec/BPMN/20100524/MODEL" xmlns:bpmndi="http://www.omg.org/spec/BPMN/20100524/DI" xmlns:pb="http://pflegebrille.de/schema/bpmn/pb-extension/v1.0.0" xmlns:di="http://www.omg.org/spec/DD/20100524/DI" xmlns:dc="http://www.omg.org/spec/DD/20100524/DC" xmlns:bioc="http://bpmn.io/schema/bpmn/biocolor/1.0" id="Definitions" targetNamespace="http://bpmn.io/schema/bpmn" exporter="pflegebrille-workflow-modeler" exporterVersion="1.0.1 (debug)" xsi:schemaLocation="http://www.omg.org/spec/BPMN/20100524/MODEL BPMN20.xsd">
          <bpmn:extensionElements>
            <pb:assets />
            <pb:data>
              <pb:datum id="Datum_1x8r6cq" name="Patient" type="Patient" isCollection="false" />
              <pb:datum id="Datum_1ipybm4" name="Wunde" type="Wound" isCollection="false" />
            </pb:data>
          </bpmn:extensionElements>
          <bpmn:process id="Process" isExecutable="true">
            <bpmn:startEvent id="Event_0kbyusg" name="Start">
              <bpmn:outgoing>Flow_1tgv2zq</bpmn:outgoing>
            </bpmn:startEvent>
            <bpmn:userTask id="Activity_0rgx31a" name="Patient scannen/wählen">
              <bpmn:extensionElements>
                <pb:userTaskExtension>
                  <pb:patientSelect patientOutput="Datum_1x8r6cq" />
                </pb:userTaskExtension>
              </bpmn:extensionElements>
              <bpmn:incoming>Flow_0ljex1v</bpmn:incoming>
              <bpmn:outgoing>Flow_107c80s</bpmn:outgoing>
            </bpmn:userTask>
            <bpmn:userTask id="Activity_18pw5b0" name="Bestehende Wunde auswählen">
              <bpmn:extensionElements>
                <pb:userTaskExtension>
                  <pb:woundSelect patientInput="Datum_1x8r6cq" woundOutput="Datum_1ipybm4" />
                </pb:userTaskExtension>
              </bpmn:extensionElements>
              <bpmn:incoming>Flow_0h54cg0</bpmn:incoming>
              <bpmn:outgoing>Flow_0prqj6e</bpmn:outgoing>
            </bpmn:userTask>
            <bpmn:exclusiveGateway id="Gateway_1wv4yfy">
              <bpmn:incoming>Flow_0prqj6e</bpmn:incoming>
              <bpmn:outgoing>Flow_1ri2anq</bpmn:outgoing>
              <bpmn:outgoing>Flow_1vsonvb</bpmn:outgoing>
            </bpmn:exclusiveGateway>
            <bpmn:sequenceFlow id="Flow_0prqj6e" sourceRef="Activity_18pw5b0" targetRef="Gateway_1wv4yfy" />
            <bpmn:exclusiveGateway id="Gateway_0oyspnr">
              <bpmn:incoming>Flow_1ri2anq</bpmn:incoming>
              <bpmn:incoming>Flow_107c80s</bpmn:incoming>
              <bpmn:outgoing>Flow_0h54cg0</bpmn:outgoing>
            </bpmn:exclusiveGateway>
            <bpmn:sequenceFlow id="Flow_1ri2anq" sourceRef="Gateway_1wv4yfy" targetRef="Gateway_0oyspnr" />
            <bpmn:sequenceFlow id="Flow_107c80s" sourceRef="Activity_0rgx31a" targetRef="Gateway_0oyspnr" />
            <bpmn:sequenceFlow id="Flow_0h54cg0" sourceRef="Gateway_0oyspnr" targetRef="Activity_18pw5b0" />
            <bpmn:exclusiveGateway id="Gateway_06tppos">
              <bpmn:incoming>Flow_1tgv2zq</bpmn:incoming>
              <bpmn:outgoing>Flow_0ljex1v</bpmn:outgoing>
            </bpmn:exclusiveGateway>
            <bpmn:sequenceFlow id="Flow_1tgv2zq" sourceRef="Event_0kbyusg" targetRef="Gateway_06tppos" />
            <bpmn:sequenceFlow id="Flow_0ljex1v" sourceRef="Gateway_06tppos" targetRef="Activity_0rgx31a" />
            <bpmn:serviceTask id="Activity_19ch8gp">
              <bpmn:extensionElements>
                <pb:serviceTaskExtension>
                  <pb:concatData firstInput="Datum_1ipybm4" />
                </pb:serviceTaskExtension>
              </bpmn:extensionElements>
              <bpmn:incoming>Flow_1vsonvb</bpmn:incoming>
            </bpmn:serviceTask>
            <bpmn:sequenceFlow id="Flow_1vsonvb" sourceRef="Gateway_1wv4yfy" targetRef="Activity_19ch8gp" />
          </bpmn:process>
          <bpmndi:BPMNDiagram id="BPMNDiagram_1">
            <bpmndi:BPMNPlane id="BPMNPlane_1" bpmnElement="Process">
              <bpmndi:BPMNEdge id="Flow_1vsonvb_di" bpmnElement="Flow_1vsonvb">
                <di:waypoint x="1195" y="460" />
                <di:waypoint x="1250" y="460" />
              </bpmndi:BPMNEdge>
              <bpmndi:BPMNEdge id="Flow_0ljex1v_di" bpmnElement="Flow_0ljex1v">
                <di:waypoint x="455" y="293" />
                <di:waypoint x="590" y="293" />
              </bpmndi:BPMNEdge>
              <bpmndi:BPMNEdge id="Flow_1tgv2zq_di" bpmnElement="Flow_1tgv2zq">
                <di:waypoint x="288" y="293" />
                <di:waypoint x="405" y="293" />
              </bpmndi:BPMNEdge>
              <bpmndi:BPMNEdge id="Flow_0h54cg0_di" bpmnElement="Flow_0h54cg0">
                <di:waypoint x="880" y="435" />
                <di:waypoint x="880" y="293" />
                <di:waypoint x="990" y="293" />
              </bpmndi:BPMNEdge>
              <bpmndi:BPMNEdge id="Flow_107c80s_di" bpmnElement="Flow_107c80s">
                <di:waypoint x="640" y="333" />
                <di:waypoint x="640" y="460" />
                <di:waypoint x="855" y="460" />
              </bpmndi:BPMNEdge>
              <bpmndi:BPMNEdge id="Flow_1ri2anq_di" bpmnElement="Flow_1ri2anq">
                <di:waypoint x="1145" y="460" />
                <di:waypoint x="905" y="460" />
              </bpmndi:BPMNEdge>
              <bpmndi:BPMNEdge id="Flow_0prqj6e_di" bpmnElement="Flow_0prqj6e">
                <di:waypoint x="1090" y="293" />
                <di:waypoint x="1170" y="293" />
                <di:waypoint x="1170" y="435" />
              </bpmndi:BPMNEdge>
              <bpmndi:BPMNShape id="Event_0kbyusg_di" bpmnElement="Event_0kbyusg">
                <dc:Bounds x="252" y="275" width="36" height="36" />
                <bpmndi:BPMNLabel>
                  <dc:Bounds x="259" y="318" width="24" height="14" />
                </bpmndi:BPMNLabel>
              </bpmndi:BPMNShape>
              <bpmndi:BPMNShape id="Activity_0rgx31a_di" bpmnElement="Activity_0rgx31a" bioc:stroke="#1978ff" bioc:fill="#ebebf9">
                <dc:Bounds x="590" y="253" width="100" height="80" />
              </bpmndi:BPMNShape>
              <bpmndi:BPMNShape id="Activity_18pw5b0_di" bpmnElement="Activity_18pw5b0" bioc:stroke="#1978ff" bioc:fill="#ebebf9">
                <dc:Bounds x="990" y="253" width="100" height="80" />
              </bpmndi:BPMNShape>
              <bpmndi:BPMNShape id="Gateway_1wv4yfy_di" bpmnElement="Gateway_1wv4yfy" isMarkerVisible="true">
                <dc:Bounds x="1145" y="435" width="50" height="50" />
              </bpmndi:BPMNShape>
              <bpmndi:BPMNShape id="Gateway_0oyspnr_di" bpmnElement="Gateway_0oyspnr" isMarkerVisible="true">
                <dc:Bounds x="855" y="435" width="50" height="50" />
              </bpmndi:BPMNShape>
              <bpmndi:BPMNShape id="Gateway_06tppos_di" bpmnElement="Gateway_06tppos" isMarkerVisible="true">
                <dc:Bounds x="405" y="268" width="50" height="50" />
              </bpmndi:BPMNShape>
              <bpmndi:BPMNShape id="Activity_19ch8gp_di" bpmnElement="Activity_19ch8gp" bioc:stroke="#ae3f3f" bioc:fill="#f6ebeb">
                <dc:Bounds x="1250" y="420" width="100" height="80" />
              </bpmndi:BPMNShape>
            </bpmndi:BPMNPlane>
          </bpmndi:BPMNDiagram>
        </bpmn:definitions>
        `;
    const msg = await lintModel(xml);
    expect(msg).toHaveLength(0);
  });

  it('used correctly linear', async () => {
    const xml = `<?xml version="1.0" encoding="UTF-8"?>
        <bpmn:definitions xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:bpmn="http://www.omg.org/spec/BPMN/20100524/MODEL" xmlns:bpmndi="http://www.omg.org/spec/BPMN/20100524/DI" xmlns:pb="http://pflegebrille.de/schema/bpmn/pb-extension/v1.0.0" xmlns:di="http://www.omg.org/spec/DD/20100524/DI" xmlns:dc="http://www.omg.org/spec/DD/20100524/DC" xmlns:bioc="http://bpmn.io/schema/bpmn/biocolor/1.0" id="Definitions" targetNamespace="http://bpmn.io/schema/bpmn" exporter="pflegebrille-workflow-modeler" exporterVersion="1.0.1 (debug)" xsi:schemaLocation="http://www.omg.org/spec/BPMN/20100524/MODEL BPMN20.xsd">
          <bpmn:extensionElements>
            <pb:assets />
            <pb:data>
              <pb:datum id="Datum_1x8r6cq" name="Patient" type="Patient" isCollection="false" />
              <pb:datum id="Datum_1ipybm4" name="Wunde" type="Wound" isCollection="false" />
            </pb:data>
          </bpmn:extensionElements>
          <bpmn:process id="Process" isExecutable="true">
            <bpmn:startEvent id="Event_0kbyusg" name="Start">
              <bpmn:outgoing>Flow_1mmc9hh</bpmn:outgoing>
            </bpmn:startEvent>
            <bpmn:userTask id="Activity_0rgx31a" name="Patient scannen/wählen">
              <bpmn:extensionElements>
                <pb:userTaskExtension>
                  <pb:patientSelect patientOutput="Datum_1x8r6cq" />
                </pb:userTaskExtension>
              </bpmn:extensionElements>
              <bpmn:incoming>Flow_1mmc9hh</bpmn:incoming>
              <bpmn:outgoing>Flow_1wz7b7q</bpmn:outgoing>
            </bpmn:userTask>
            <bpmn:userTask id="Activity_18pw5b0" name="Bestehende Wunde auswählen">
              <bpmn:extensionElements>
                <pb:userTaskExtension>
                  <pb:woundSelect patientInput="Datum_1x8r6cq" woundOutput="Datum_1ipybm4" />
                </pb:userTaskExtension>
              </bpmn:extensionElements>
              <bpmn:incoming>Flow_1wz7b7q</bpmn:incoming>
            </bpmn:userTask>
            <bpmn:sequenceFlow id="Flow_1mmc9hh" sourceRef="Event_0kbyusg" targetRef="Activity_0rgx31a" />
            <bpmn:sequenceFlow id="Flow_1wz7b7q" sourceRef="Activity_0rgx31a" targetRef="Activity_18pw5b0" />
          </bpmn:process>
          <bpmndi:BPMNDiagram id="BPMNDiagram_1">
            <bpmndi:BPMNPlane id="BPMNPlane_1" bpmnElement="Process">
              <bpmndi:BPMNEdge id="Flow_1mmc9hh_di" bpmnElement="Flow_1mmc9hh">
                <di:waypoint x="288" y="293" />
                <di:waypoint x="590" y="293" />
              </bpmndi:BPMNEdge>
              <bpmndi:BPMNEdge id="Flow_1wz7b7q_di" bpmnElement="Flow_1wz7b7q">
                <di:waypoint x="690" y="293" />
                <di:waypoint x="800" y="293" />
              </bpmndi:BPMNEdge>
              <bpmndi:BPMNShape id="Event_0kbyusg_di" bpmnElement="Event_0kbyusg">
                <dc:Bounds x="252" y="275" width="36" height="36" />
                <bpmndi:BPMNLabel>
                  <dc:Bounds x="259" y="318" width="24" height="14" />
                </bpmndi:BPMNLabel>
              </bpmndi:BPMNShape>
              <bpmndi:BPMNShape id="Activity_0rgx31a_di" bpmnElement="Activity_0rgx31a" bioc:stroke="#1978ff" bioc:fill="#ebebf9">
                <dc:Bounds x="590" y="253" width="100" height="80" />
              </bpmndi:BPMNShape>
              <bpmndi:BPMNShape id="Activity_18pw5b0_di" bpmnElement="Activity_18pw5b0" bioc:stroke="#1978ff" bioc:fill="#ebebf9">
                <dc:Bounds x="800" y="253" width="100" height="80" />
              </bpmndi:BPMNShape>
            </bpmndi:BPMNPlane>
          </bpmndi:BPMNDiagram>
        </bpmn:definitions>
        `;
    const msg = await lintModel(xml);
    expect(msg).toHaveLength(0);
  });

  it('used before init linear', async () => {
    const xml = `<?xml version="1.0" encoding="UTF-8"?>
        <bpmn:definitions xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:bpmn="http://www.omg.org/spec/BPMN/20100524/MODEL" xmlns:bpmndi="http://www.omg.org/spec/BPMN/20100524/DI" xmlns:pb="http://pflegebrille.de/schema/bpmn/pb-extension/v1.0.0" xmlns:di="http://www.omg.org/spec/DD/20100524/DI" xmlns:dc="http://www.omg.org/spec/DD/20100524/DC" xmlns:bioc="http://bpmn.io/schema/bpmn/biocolor/1.0" id="Definitions" targetNamespace="http://bpmn.io/schema/bpmn" exporter="pflegebrille-workflow-modeler" exporterVersion="1.0.1 (debug)" xsi:schemaLocation="http://www.omg.org/spec/BPMN/20100524/MODEL BPMN20.xsd">
          <bpmn:extensionElements>
            <pb:assets />
            <pb:data>
              <pb:datum id="Datum_1x8r6cq" name="Patient" type="Patient" isCollection="false" />
              <pb:datum id="Datum_1ipybm4" name="Wunde" type="Wound" isCollection="false" />
            </pb:data>
          </bpmn:extensionElements>
          <bpmn:process id="Process" isExecutable="true">
            <bpmn:startEvent id="Event_0kbyusg" name="Start">
              <bpmn:outgoing>Flow_00pebrk</bpmn:outgoing>
            </bpmn:startEvent>
            <bpmn:userTask id="Activity_0rgx31a" name="Patient scannen/wählen">
              <bpmn:extensionElements>
                <pb:userTaskExtension>
                  <pb:patientSelect patientOutput="Datum_1x8r6cq" />
                </pb:userTaskExtension>
              </bpmn:extensionElements>
              <bpmn:incoming>Flow_1nr52ek</bpmn:incoming>
            </bpmn:userTask>
            <bpmn:userTask id="Activity_18pw5b0" name="Bestehende Wunde auswählen">
              <bpmn:extensionElements>
                <pb:userTaskExtension>
                  <pb:woundSelect patientInput="Datum_1x8r6cq" woundOutput="Datum_1ipybm4" />
                </pb:userTaskExtension>
              </bpmn:extensionElements>
              <bpmn:incoming>Flow_00pebrk</bpmn:incoming>
              <bpmn:outgoing>Flow_1nr52ek</bpmn:outgoing>
            </bpmn:userTask>
            <bpmn:sequenceFlow id="Flow_00pebrk" sourceRef="Event_0kbyusg" targetRef="Activity_18pw5b0" />
            <bpmn:sequenceFlow id="Flow_1nr52ek" sourceRef="Activity_18pw5b0" targetRef="Activity_0rgx31a" />
          </bpmn:process>
          <bpmndi:BPMNDiagram id="BPMNDiagram_1">
            <bpmndi:BPMNPlane id="BPMNPlane_1" bpmnElement="Process">
              <bpmndi:BPMNEdge id="Flow_00pebrk_di" bpmnElement="Flow_00pebrk">
                <di:waypoint x="288" y="293" />
                <di:waypoint x="390" y="293" />
              </bpmndi:BPMNEdge>
              <bpmndi:BPMNEdge id="Flow_1nr52ek_di" bpmnElement="Flow_1nr52ek">
                <di:waypoint x="490" y="293" />
                <di:waypoint x="590" y="293" />
              </bpmndi:BPMNEdge>
              <bpmndi:BPMNShape id="Event_0kbyusg_di" bpmnElement="Event_0kbyusg">
                <dc:Bounds x="252" y="275" width="36" height="36" />
                <bpmndi:BPMNLabel>
                  <dc:Bounds x="259" y="318" width="24" height="14" />
                </bpmndi:BPMNLabel>
              </bpmndi:BPMNShape>
              <bpmndi:BPMNShape id="Activity_0rgx31a_di" bpmnElement="Activity_0rgx31a" bioc:stroke="#1978ff" bioc:fill="#ebebf9">
                <dc:Bounds x="590" y="253" width="100" height="80" />
              </bpmndi:BPMNShape>
              <bpmndi:BPMNShape id="Activity_18pw5b0_di" bpmnElement="Activity_18pw5b0" bioc:stroke="#1978ff" bioc:fill="#ebebf9">
                <dc:Bounds x="390" y="253" width="100" height="80" />
              </bpmndi:BPMNShape>
            </bpmndi:BPMNPlane>
          </bpmndi:BPMNDiagram>
        </bpmn:definitions>
        `;
    const msg = await lintModel(xml);
    expect(msg).toHaveLength(1);
  });


  it('used correctly in combination with subprocess', async () => {
    const xml = `<?xml version="1.0" encoding="UTF-8"?>
        <bpmn:definitions xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:bpmn="http://www.omg.org/spec/BPMN/20100524/MODEL" xmlns:bpmndi="http://www.omg.org/spec/BPMN/20100524/DI" xmlns:pb="http://pflegebrille.de/schema/bpmn/pb-extension/v1.0.0" xmlns:di="http://www.omg.org/spec/DD/20100524/DI" xmlns:dc="http://www.omg.org/spec/DD/20100524/DC" xmlns:bioc="http://bpmn.io/schema/bpmn/biocolor/1.0" id="Definitions" targetNamespace="http://bpmn.io/schema/bpmn" exporter="pflegebrille-workflow-modeler" exporterVersion="1.0.1 (debug)" xsi:schemaLocation="http://www.omg.org/spec/BPMN/20100524/MODEL BPMN20.xsd">
          <bpmn:extensionElements>
            <pb:assets />
            <pb:data>
              <pb:datum id="Datum_1x8r6cq" name="Patient" type="Patient" isCollection="false" />
              <pb:datum id="Datum_1ipybm4" name="Wunde" type="Wound" isCollection="false" />
            </pb:data>
          </bpmn:extensionElements>
          <bpmn:process id="Process" isExecutable="true">
            <bpmn:startEvent id="Event_0kbyusg" name="Start">
              <bpmn:outgoing>Flow_1u1exe7</bpmn:outgoing>
            </bpmn:startEvent>
            <bpmn:userTask id="Activity_0rgx31a" name="Patient scannen/wählen">
              <bpmn:extensionElements>
                <pb:userTaskExtension>
                  <pb:patientSelect patientOutput="Datum_1x8r6cq" />
                </pb:userTaskExtension>
              </bpmn:extensionElements>
              <bpmn:incoming>Flow_1u1exe7</bpmn:incoming>
              <bpmn:outgoing>Flow_0s4sp93</bpmn:outgoing>
            </bpmn:userTask>
            <bpmn:subProcess id="Activity_0a44yqn">
              <bpmn:incoming>Flow_0s4sp93</bpmn:incoming>
              <bpmn:outgoing>Flow_0v238pk</bpmn:outgoing>
              <bpmn:startEvent id="Event_1fp2eov">
                <bpmn:outgoing>Flow_0prtymk</bpmn:outgoing>
              </bpmn:startEvent>
              <bpmn:userTask id="Activity_18pw5b0" name="Bestehende Wunde auswählen">
                <bpmn:extensionElements>
                  <pb:userTaskExtension>
                    <pb:woundSelect patientInput="Datum_1x8r6cq" woundOutput="Datum_1ipybm4" />
                  </pb:userTaskExtension>
                </bpmn:extensionElements>
                <bpmn:incoming>Flow_0prtymk</bpmn:incoming>
                <bpmn:outgoing>Flow_0j3zg19</bpmn:outgoing>
              </bpmn:userTask>
              <bpmn:sequenceFlow id="Flow_0prtymk" sourceRef="Event_1fp2eov" targetRef="Activity_18pw5b0" />
              <bpmn:endEvent id="Event_0g5zwt8">
                <bpmn:incoming>Flow_0j3zg19</bpmn:incoming>
              </bpmn:endEvent>
              <bpmn:sequenceFlow id="Flow_0j3zg19" sourceRef="Activity_18pw5b0" targetRef="Event_0g5zwt8" />
            </bpmn:subProcess>
            <bpmn:sequenceFlow id="Flow_1u1exe7" sourceRef="Event_0kbyusg" targetRef="Activity_0rgx31a" />
            <bpmn:sequenceFlow id="Flow_0s4sp93" sourceRef="Activity_0rgx31a" targetRef="Activity_0a44yqn" />
            <bpmn:serviceTask id="Activity_0e62max">
              <bpmn:extensionElements>
                <pb:serviceTaskExtension>
                  <pb:concatData firstInput="Datum_1ipybm4" />
                </pb:serviceTaskExtension>
              </bpmn:extensionElements>
              <bpmn:incoming>Flow_0v238pk</bpmn:incoming>
            </bpmn:serviceTask>
            <bpmn:sequenceFlow id="Flow_0v238pk" sourceRef="Activity_0a44yqn" targetRef="Activity_0e62max" />
          </bpmn:process>
          <bpmndi:BPMNDiagram id="BPMNDiagram_1">
            <bpmndi:BPMNPlane id="BPMNPlane_1" bpmnElement="Process">
              <bpmndi:BPMNEdge id="Flow_1u1exe7_di" bpmnElement="Flow_1u1exe7">
                <di:waypoint x="288" y="293" />
                <di:waypoint x="500" y="293" />
              </bpmndi:BPMNEdge>
              <bpmndi:BPMNEdge id="Flow_0s4sp93_di" bpmnElement="Flow_0s4sp93">
                <di:waypoint x="600" y="293" />
                <di:waypoint x="770" y="293" />
              </bpmndi:BPMNEdge>
              <bpmndi:BPMNEdge id="Flow_0v238pk_di" bpmnElement="Flow_0v238pk">
                <di:waypoint x="1120" y="330" />
                <di:waypoint x="1290" y="330" />
              </bpmndi:BPMNEdge>
              <bpmndi:BPMNShape id="Event_0kbyusg_di" bpmnElement="Event_0kbyusg">
                <dc:Bounds x="252" y="275" width="36" height="36" />
                <bpmndi:BPMNLabel>
                  <dc:Bounds x="259" y="318" width="24" height="14" />
                </bpmndi:BPMNLabel>
              </bpmndi:BPMNShape>
              <bpmndi:BPMNShape id="Activity_0rgx31a_di" bpmnElement="Activity_0rgx31a" bioc:stroke="#1978ff" bioc:fill="#ebebf9">
                <dc:Bounds x="500" y="253" width="100" height="80" />
              </bpmndi:BPMNShape>
              <bpmndi:BPMNShape id="Activity_0e62max_di" bpmnElement="Activity_0e62max" bioc:stroke="#ae3f3f" bioc:fill="#f6ebeb">
                <dc:Bounds x="1290" y="290" width="100" height="80" />
              </bpmndi:BPMNShape>
              <bpmndi:BPMNShape id="Activity_0a44yqn_di" bpmnElement="Activity_0a44yqn" isExpanded="true">
                <dc:Bounds x="770" y="230" width="350" height="200" />
              </bpmndi:BPMNShape>
              <bpmndi:BPMNEdge id="Flow_0prtymk_di" bpmnElement="Flow_0prtymk">
                <di:waypoint x="846" y="330" />
                <di:waypoint x="900" y="330" />
              </bpmndi:BPMNEdge>
              <bpmndi:BPMNEdge id="Flow_0j3zg19_di" bpmnElement="Flow_0j3zg19">
                <di:waypoint x="1000" y="330" />
                <di:waypoint x="1062" y="330" />
              </bpmndi:BPMNEdge>
              <bpmndi:BPMNShape id="Event_1fp2eov_di" bpmnElement="Event_1fp2eov">
                <dc:Bounds x="810" y="312" width="36" height="36" />
              </bpmndi:BPMNShape>
              <bpmndi:BPMNShape id="Activity_18pw5b0_di" bpmnElement="Activity_18pw5b0" bioc:stroke="#1978ff" bioc:fill="#ebebf9">
                <dc:Bounds x="900" y="290" width="100" height="80" />
              </bpmndi:BPMNShape>
              <bpmndi:BPMNShape id="Event_0g5zwt8_di" bpmnElement="Event_0g5zwt8">
                <dc:Bounds x="1062" y="312" width="36" height="36" />
              </bpmndi:BPMNShape>
            </bpmndi:BPMNPlane>
          </bpmndi:BPMNDiagram>
        </bpmn:definitions>
        `;
    const msg = await lintModel(xml);
    expect(msg).toHaveLength(0);
  });

  it('used correctly with subprocess and cycle', async () => {
    const xml = `<?xml version="1.0" encoding="UTF-8"?>
        <bpmn:definitions xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:bpmn="http://www.omg.org/spec/BPMN/20100524/MODEL" xmlns:bpmndi="http://www.omg.org/spec/BPMN/20100524/DI" xmlns:pb="http://pflegebrille.de/schema/bpmn/pb-extension/v1.0.0" xmlns:di="http://www.omg.org/spec/DD/20100524/DI" xmlns:dc="http://www.omg.org/spec/DD/20100524/DC" xmlns:bioc="http://bpmn.io/schema/bpmn/biocolor/1.0" id="Definitions" targetNamespace="http://bpmn.io/schema/bpmn" exporter="pflegebrille-workflow-modeler" exporterVersion="1.0.1 (debug)" xsi:schemaLocation="http://www.omg.org/spec/BPMN/20100524/MODEL BPMN20.xsd">
          <bpmn:extensionElements>
            <pb:assets />
            <pb:data>
              <pb:datum id="Datum_1x8r6cq" name="Patient" type="Patient" isCollection="false" />
              <pb:datum id="Datum_1ipybm4" name="Wunde" type="Wound" isCollection="false" />
            </pb:data>
          </bpmn:extensionElements>
          <bpmn:process id="Process" isExecutable="true">
            <bpmn:startEvent id="Event_0kbyusg" name="Start">
              <bpmn:outgoing>Flow_1u1exe7</bpmn:outgoing>
            </bpmn:startEvent>
            <bpmn:userTask id="Activity_0rgx31a" name="Patient scannen/wählen">
              <bpmn:extensionElements>
                <pb:userTaskExtension>
                  <pb:patientSelect patientOutput="Datum_1x8r6cq" />
                </pb:userTaskExtension>
              </bpmn:extensionElements>
              <bpmn:incoming>Flow_1u1exe7</bpmn:incoming>
              <bpmn:outgoing>Flow_0yicplg</bpmn:outgoing>
            </bpmn:userTask>
            <bpmn:subProcess id="Activity_0a44yqn">
              <bpmn:incoming>Flow_0y1e2d5</bpmn:incoming>
              <bpmn:outgoing>Flow_0ju72y2</bpmn:outgoing>
              <bpmn:startEvent id="Event_1fp2eov">
                <bpmn:outgoing>Flow_0prtymk</bpmn:outgoing>
              </bpmn:startEvent>
              <bpmn:userTask id="Activity_18pw5b0" name="Bestehende Wunde auswählen">
                <bpmn:extensionElements>
                  <pb:userTaskExtension>
                    <pb:woundSelect patientInput="Datum_1x8r6cq" woundOutput="Datum_1ipybm4" />
                  </pb:userTaskExtension>
                </bpmn:extensionElements>
                <bpmn:incoming>Flow_0prtymk</bpmn:incoming>
                <bpmn:outgoing>Flow_0j3zg19</bpmn:outgoing>
              </bpmn:userTask>
              <bpmn:sequenceFlow id="Flow_0prtymk" sourceRef="Event_1fp2eov" targetRef="Activity_18pw5b0" />
              <bpmn:endEvent id="Event_0g5zwt8">
                <bpmn:incoming>Flow_0j3zg19</bpmn:incoming>
              </bpmn:endEvent>
              <bpmn:sequenceFlow id="Flow_0j3zg19" sourceRef="Activity_18pw5b0" targetRef="Event_0g5zwt8" />
            </bpmn:subProcess>
            <bpmn:sequenceFlow id="Flow_1u1exe7" sourceRef="Event_0kbyusg" targetRef="Activity_0rgx31a" />
            <bpmn:serviceTask id="Activity_0e62max">
              <bpmn:extensionElements>
                <pb:serviceTaskExtension>
                  <pb:concatData firstInput="Datum_1ipybm4" />
                </pb:serviceTaskExtension>
              </bpmn:extensionElements>
              <bpmn:incoming>Flow_115l2nl</bpmn:incoming>
            </bpmn:serviceTask>
            <bpmn:exclusiveGateway id="Gateway_1joaw7t">
              <bpmn:incoming>Flow_0yicplg</bpmn:incoming>
              <bpmn:incoming>Flow_1cczty5</bpmn:incoming>
              <bpmn:outgoing>Flow_0y1e2d5</bpmn:outgoing>
            </bpmn:exclusiveGateway>
            <bpmn:exclusiveGateway id="Gateway_0iqpgrc">
              <bpmn:incoming>Flow_0ju72y2</bpmn:incoming>
              <bpmn:outgoing>Flow_1cczty5</bpmn:outgoing>
              <bpmn:outgoing>Flow_115l2nl</bpmn:outgoing>
            </bpmn:exclusiveGateway>
            <bpmn:sequenceFlow id="Flow_0yicplg" sourceRef="Activity_0rgx31a" targetRef="Gateway_1joaw7t" />
            <bpmn:sequenceFlow id="Flow_0y1e2d5" sourceRef="Gateway_1joaw7t" targetRef="Activity_0a44yqn" />
            <bpmn:sequenceFlow id="Flow_0ju72y2" sourceRef="Activity_0a44yqn" targetRef="Gateway_0iqpgrc" />
            <bpmn:sequenceFlow id="Flow_1cczty5" sourceRef="Gateway_0iqpgrc" targetRef="Gateway_1joaw7t" />
            <bpmn:sequenceFlow id="Flow_115l2nl" sourceRef="Gateway_0iqpgrc" targetRef="Activity_0e62max" />
          </bpmn:process>
          <bpmndi:BPMNDiagram id="BPMNDiagram_1">
            <bpmndi:BPMNPlane id="BPMNPlane_1" bpmnElement="Process">
              <bpmndi:BPMNEdge id="Flow_1u1exe7_di" bpmnElement="Flow_1u1exe7">
                <di:waypoint x="288" y="363" />
                <di:waypoint x="500" y="363" />
              </bpmndi:BPMNEdge>
              <bpmndi:BPMNEdge id="Flow_0yicplg_di" bpmnElement="Flow_0yicplg">
                <di:waypoint x="600" y="363" />
                <di:waypoint x="655" y="363" />
              </bpmndi:BPMNEdge>
              <bpmndi:BPMNEdge id="Flow_0y1e2d5_di" bpmnElement="Flow_0y1e2d5">
                <di:waypoint x="705" y="363" />
                <di:waypoint x="770" y="363" />
              </bpmndi:BPMNEdge>
              <bpmndi:BPMNEdge id="Flow_0ju72y2_di" bpmnElement="Flow_0ju72y2">
                <di:waypoint x="1120" y="380" />
                <di:waypoint x="1215" y="380" />
              </bpmndi:BPMNEdge>
              <bpmndi:BPMNEdge id="Flow_1cczty5_di" bpmnElement="Flow_1cczty5">
                <di:waypoint x="1240" y="405" />
                <di:waypoint x="1240" y="680" />
                <di:waypoint x="680" y="680" />
                <di:waypoint x="680" y="388" />
              </bpmndi:BPMNEdge>
              <bpmndi:BPMNEdge id="Flow_115l2nl_di" bpmnElement="Flow_115l2nl">
                <di:waypoint x="1240" y="355" />
                <di:waypoint x="1240" y="248" />
                <di:waypoint x="1430" y="248" />
                <di:waypoint x="1430" y="340" />
              </bpmndi:BPMNEdge>
              <bpmndi:BPMNShape id="Event_0kbyusg_di" bpmnElement="Event_0kbyusg">
                <dc:Bounds x="252" y="345" width="36" height="36" />
                <bpmndi:BPMNLabel>
                  <dc:Bounds x="259" y="388" width="24" height="14" />
                </bpmndi:BPMNLabel>
              </bpmndi:BPMNShape>
              <bpmndi:BPMNShape id="Activity_0rgx31a_di" bpmnElement="Activity_0rgx31a" bioc:stroke="#1978ff" bioc:fill="#ebebf9">
                <dc:Bounds x="500" y="323" width="100" height="80" />
              </bpmndi:BPMNShape>
              <bpmndi:BPMNShape id="Gateway_1joaw7t_di" bpmnElement="Gateway_1joaw7t" isMarkerVisible="true">
                <dc:Bounds x="655" y="338" width="50" height="50" />
              </bpmndi:BPMNShape>
              <bpmndi:BPMNShape id="Gateway_0iqpgrc_di" bpmnElement="Gateway_0iqpgrc" isMarkerVisible="true">
                <dc:Bounds x="1215" y="355" width="50" height="50" />
              </bpmndi:BPMNShape>
              <bpmndi:BPMNShape id="Activity_0e62max_di" bpmnElement="Activity_0e62max" bioc:stroke="#ae3f3f" bioc:fill="#f6ebeb">
                <dc:Bounds x="1380" y="340" width="100" height="80" />
              </bpmndi:BPMNShape>
              <bpmndi:BPMNShape id="Activity_0a44yqn_di" bpmnElement="Activity_0a44yqn" isExpanded="true">
                <dc:Bounds x="770" y="300" width="350" height="200" />
              </bpmndi:BPMNShape>
              <bpmndi:BPMNEdge id="Flow_0j3zg19_di" bpmnElement="Flow_0j3zg19">
                <di:waypoint x="1000" y="400" />
                <di:waypoint x="1062" y="400" />
              </bpmndi:BPMNEdge>
              <bpmndi:BPMNEdge id="Flow_0prtymk_di" bpmnElement="Flow_0prtymk">
                <di:waypoint x="846" y="400" />
                <di:waypoint x="900" y="400" />
              </bpmndi:BPMNEdge>
              <bpmndi:BPMNShape id="Event_1fp2eov_di" bpmnElement="Event_1fp2eov">
                <dc:Bounds x="810" y="382" width="36" height="36" />
              </bpmndi:BPMNShape>
              <bpmndi:BPMNShape id="Activity_18pw5b0_di" bpmnElement="Activity_18pw5b0" bioc:stroke="#1978ff" bioc:fill="#ebebf9">
                <dc:Bounds x="900" y="360" width="100" height="80" />
              </bpmndi:BPMNShape>
              <bpmndi:BPMNShape id="Event_0g5zwt8_di" bpmnElement="Event_0g5zwt8">
                <dc:Bounds x="1062" y="382" width="36" height="36" />
              </bpmndi:BPMNShape>
            </bpmndi:BPMNPlane>
          </bpmndi:BPMNDiagram>
        </bpmn:definitions>
        `;
    const msg = await lintModel(xml);
    expect(msg).toHaveLength(0);
  });

  it('used wrong datum', async () => {
    const xml = `<?xml version="1.0" encoding="UTF-8"?>
        <bpmn:definitions xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:bpmn="http://www.omg.org/spec/BPMN/20100524/MODEL" xmlns:bpmndi="http://www.omg.org/spec/BPMN/20100524/DI" xmlns:pb="http://pflegebrille.de/schema/bpmn/pb-extension/v1.0.0" xmlns:di="http://www.omg.org/spec/DD/20100524/DI" xmlns:dc="http://www.omg.org/spec/DD/20100524/DC" xmlns:bioc="http://bpmn.io/schema/bpmn/biocolor/1.0" id="Definitions" targetNamespace="http://bpmn.io/schema/bpmn" exporter="pflegebrille-workflow-modeler" exporterVersion="1.0.1 (debug)" xsi:schemaLocation="http://www.omg.org/spec/BPMN/20100524/MODEL BPMN20.xsd">
          <bpmn:extensionElements>
            <pb:assets />
            <pb:data>
              <pb:datum id="Datum_1x8r6cq" name="Patient" type="Patient" isCollection="false" />
              <pb:datum id="Datum_1ipybm4" name="Wunde" type="Wound" isCollection="false" />
              <pb:datum id="Datum_0u0sihs" name="Patient 2ZIQ" type="Patient" />
            </pb:data>
          </bpmn:extensionElements>
          <bpmn:process id="Process" isExecutable="true">
            <bpmn:startEvent id="Event_0kbyusg" name="Start">
              <bpmn:outgoing>Flow_1u1exe7</bpmn:outgoing>
            </bpmn:startEvent>
            <bpmn:userTask id="Activity_0rgx31a" name="Patient scannen/wählen">
              <bpmn:extensionElements>
                <pb:userTaskExtension>
                  <pb:patientSelect patientOutput="Datum_1x8r6cq" />
                </pb:userTaskExtension>
              </bpmn:extensionElements>
              <bpmn:incoming>Flow_1u1exe7</bpmn:incoming>
              <bpmn:outgoing>Flow_1swphyp</bpmn:outgoing>
            </bpmn:userTask>
            <bpmn:subProcess id="Activity_0a44yqn">
              <bpmn:incoming>Flow_1swphyp</bpmn:incoming>
              <bpmn:startEvent id="Event_1fp2eov">
                <bpmn:outgoing>Flow_0prtymk</bpmn:outgoing>
              </bpmn:startEvent>
              <bpmn:userTask id="Activity_18pw5b0" name="Bestehende Wunde auswählen">
                <bpmn:extensionElements>
                  <pb:userTaskExtension>
                    <pb:woundSelect patientInput="Datum_0u0sihs" woundOutput="Datum_1ipybm4" />
                  </pb:userTaskExtension>
                </bpmn:extensionElements>
                <bpmn:incoming>Flow_0prtymk</bpmn:incoming>
                <bpmn:outgoing>Flow_0j3zg19</bpmn:outgoing>
              </bpmn:userTask>
              <bpmn:sequenceFlow id="Flow_0prtymk" sourceRef="Event_1fp2eov" targetRef="Activity_18pw5b0" />
              <bpmn:endEvent id="Event_0g5zwt8">
                <bpmn:incoming>Flow_0j3zg19</bpmn:incoming>
              </bpmn:endEvent>
              <bpmn:sequenceFlow id="Flow_0j3zg19" sourceRef="Activity_18pw5b0" targetRef="Event_0g5zwt8" />
            </bpmn:subProcess>
            <bpmn:sequenceFlow id="Flow_1u1exe7" sourceRef="Event_0kbyusg" targetRef="Activity_0rgx31a" />
            <bpmn:sequenceFlow id="Flow_1swphyp" sourceRef="Activity_0rgx31a" targetRef="Activity_0a44yqn" />
          </bpmn:process>
          <bpmndi:BPMNDiagram id="BPMNDiagram_1">
            <bpmndi:BPMNPlane id="BPMNPlane_1" bpmnElement="Process">
              <bpmndi:BPMNEdge id="Flow_1swphyp_di" bpmnElement="Flow_1swphyp">
                <di:waypoint x="600" y="363" />
                <di:waypoint x="770" y="363" />
              </bpmndi:BPMNEdge>
              <bpmndi:BPMNEdge id="Flow_1u1exe7_di" bpmnElement="Flow_1u1exe7">
                <di:waypoint x="288" y="363" />
                <di:waypoint x="500" y="363" />
              </bpmndi:BPMNEdge>
              <bpmndi:BPMNShape id="Event_0kbyusg_di" bpmnElement="Event_0kbyusg">
                <dc:Bounds x="252" y="345" width="36" height="36" />
                <bpmndi:BPMNLabel>
                  <dc:Bounds x="259" y="388" width="24" height="14" />
                </bpmndi:BPMNLabel>
              </bpmndi:BPMNShape>
              <bpmndi:BPMNShape id="Activity_0rgx31a_di" bpmnElement="Activity_0rgx31a" bioc:stroke="#1978ff" bioc:fill="#ebebf9">
                <dc:Bounds x="500" y="323" width="100" height="80" />
              </bpmndi:BPMNShape>
              <bpmndi:BPMNShape id="Activity_0a44yqn_di" bpmnElement="Activity_0a44yqn" isExpanded="true">
                <dc:Bounds x="770" y="300" width="350" height="200" />
              </bpmndi:BPMNShape>
              <bpmndi:BPMNEdge id="Flow_0j3zg19_di" bpmnElement="Flow_0j3zg19">
                <di:waypoint x="1000" y="400" />
                <di:waypoint x="1062" y="400" />
              </bpmndi:BPMNEdge>
              <bpmndi:BPMNEdge id="Flow_0prtymk_di" bpmnElement="Flow_0prtymk">
                <di:waypoint x="846" y="400" />
                <di:waypoint x="900" y="400" />
              </bpmndi:BPMNEdge>
              <bpmndi:BPMNShape id="Event_1fp2eov_di" bpmnElement="Event_1fp2eov">
                <dc:Bounds x="810" y="382" width="36" height="36" />
              </bpmndi:BPMNShape>
              <bpmndi:BPMNShape id="Activity_18pw5b0_di" bpmnElement="Activity_18pw5b0" bioc:stroke="#1978ff" bioc:fill="#ebebf9">
                <dc:Bounds x="900" y="360" width="100" height="80" />
              </bpmndi:BPMNShape>
              <bpmndi:BPMNShape id="Event_0g5zwt8_di" bpmnElement="Event_0g5zwt8">
                <dc:Bounds x="1062" y="382" width="36" height="36" />
              </bpmndi:BPMNShape>
            </bpmndi:BPMNPlane>
          </bpmndi:BPMNDiagram>
        </bpmn:definitions>
        `;
    const msg = await lintModel(xml);
    expect(msg).toHaveLength(1);
  });

  it('output and input to same datum, that was unused before', async () => {
    const xml = `<?xml version="1.0" encoding="UTF-8"?>
      <bpmn:definitions xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:bpmn="http://www.omg.org/spec/BPMN/20100524/MODEL" xmlns:bpmndi="http://www.omg.org/spec/BPMN/20100524/DI" xmlns:pb="http://pflegebrille.de/schema/bpmn/pb-extension/v1.0.0" xmlns:di="http://www.omg.org/spec/DD/20100524/DI" xmlns:dc="http://www.omg.org/spec/DD/20100524/DC" xmlns:bioc="http://bpmn.io/schema/bpmn/biocolor/1.0" id="Definitions" targetNamespace="http://bpmn.io/schema/bpmn" exporter="pflegebrille-workflow-modeler" exporterVersion="1.0.1 (debug)" xsi:schemaLocation="http://www.omg.org/spec/BPMN/20100524/MODEL BPMN20.xsd">
        <bpmn:extensionElements>
          <pb:assets />
          <pb:data>
            <pb:datum id="Datum_1x8r6cq" name="Patienten" type="Patient" isCollection="false" />
          </pb:data>
        </bpmn:extensionElements>
        <bpmn:process id="Process" isExecutable="true">
          <bpmn:startEvent id="Event_0kbyusg" name="Start">
            <bpmn:outgoing>Flow_01jcmyi</bpmn:outgoing>
          </bpmn:startEvent>
          <bpmn:sequenceFlow id="Flow_01jcmyi" sourceRef="Event_0kbyusg" targetRef="Activity_04dugs1" />
          <bpmn:serviceTask id="Activity_04dugs1">
            <bpmn:extensionElements>
              <pb:serviceTaskExtension>
                <pb:concatData firstInput="Datum_1x8r6cq" secondInput="Datum_1x8r6cq" collectionOutput="Datum_1x8r6cq" />
              </pb:serviceTaskExtension>
            </bpmn:extensionElements>
            <bpmn:incoming>Flow_01jcmyi</bpmn:incoming>
          </bpmn:serviceTask>
        </bpmn:process>
        <bpmndi:BPMNDiagram id="BPMNDiagram_1">
          <bpmndi:BPMNPlane id="BPMNPlane_1" bpmnElement="Process">
            <bpmndi:BPMNEdge id="Flow_01jcmyi_di" bpmnElement="Flow_01jcmyi">
              <di:waypoint x="248" y="293" />
              <di:waypoint x="350" y="293" />
            </bpmndi:BPMNEdge>
            <bpmndi:BPMNShape id="Event_0kbyusg_di" bpmnElement="Event_0kbyusg">
              <dc:Bounds x="212" y="275" width="36" height="36" />
              <bpmndi:BPMNLabel>
                <dc:Bounds x="219" y="318" width="24" height="14" />
              </bpmndi:BPMNLabel>
            </bpmndi:BPMNShape>
            <bpmndi:BPMNShape id="Activity_04dugs1_di" bpmnElement="Activity_04dugs1" bioc:stroke="#ae3f3f" bioc:fill="#f6ebeb">
              <dc:Bounds x="350" y="253" width="100" height="80" />
            </bpmndi:BPMNShape>
          </bpmndi:BPMNPlane>
        </bpmndi:BPMNDiagram>
      </bpmn:definitions>
      `;

    const msg = await lintModel(xml);
    expect(msg).toHaveLength(2);
  });
});