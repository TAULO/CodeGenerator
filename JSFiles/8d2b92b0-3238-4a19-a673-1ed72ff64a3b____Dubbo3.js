import React, {Component} from 'react';
import {Anchor, Row, Col} from 'antd';


const {Link} = Anchor;


class Dubbo3 extends Component {

    s = "{";
    render() {

        return (
            <div>
                <Row>
                    <Col span={19}>
                        <h2 id="Dubbo源码的结构概述"><a href="javascript:void(0)" class="anchor">Dubbo源码的结构概述</a></h2>
                        <p>参考：<a href='http://blog.csdn.net/zuoanyinxiang/article/details/51329982' target='_blank' >http://blog.csdn.net/zuoanyinxiang/article/details/51329982</a></p>
                        <p><strong>1.dubbo源码的结构</strong></p>
                        <p><img src='http://img.blog.csdn.net/20160506110738015' alt='' /></p>
                        <p><img src='http://img.blog.csdn.net/20160506111318351' alt='' /></p>
                        <p><strong>Dubbo源文件主要包含以上这么多包，其中： </strong>
                            <strong>dubbo-common </strong>公共逻辑模块，包括Util类和通用模型。
                            <strong>dubbo-remoting </strong> 远程通讯模块，相当于Dubbo协议的实现，如果RPC用RMI协议则不需要使用此包。
                            <strong>dubbo-rpc</strong> 远程调用模块，抽象各种协议，以及动态代理，只包含一对一的调用，不关心集群的管理。
                            <strong>dubbo-cluster </strong>集群模块，将多个服务提供方伪装为一个提供方，包括：负载均衡, 容错，路由等，集群的地址列表可以是静态配置的，也可以是由注册中心下发。
                            <strong>dubbo-registry</strong> 注册中心模块，基于注册中心下发地址的集群方式，以及对各种注册中心的抽象。
                            <strong>dubbo-monitor</strong>  监控模块，统计服务调用次数，调用时间的，调用链跟踪的服务。
                            <strong>dubbo-config</strong>配置模块，是Dubbo对外的API，用户通过Config使用Dubbo，隐藏Dubbo所有细节。
                            <strong>dubbo-container</strong> 容器模块，是一个Standlone的容器，以简单的Main加载Spring启动，因为服务通常不需要Tomcat/JBoss等Web容器的特性，没必要用Web容器去加载服务。 </p>
                        <p>&nbsp;</p>
                        <p><strong>整体上按照分层结构进行分包，与分层的不同点在于： </strong></p>
                        <pre><code>container为服务容器，用于部署运行服务，没有在层中画出。 <br/>
protocol层和proxy层都放在rpc模块中，这两层是rpc的核心，在不需要集群时(只有一个提供者)，可以只使用这两层完成rpc调用。&nbsp;<br/>
transport层和exchange层都放在remoting模块中，为rpc调用的通讯基础。&nbsp;<br/>
serialize层放在common模块中，以便更大程度复用。&nbsp;<br/>
</code></pre>
                        <p>下面是更详细的Project关系图，依赖关系线有点乱。整个模块是从上到下传递依赖的。</p>
                        <p><img src='http://img.blog.csdn.net/20160506114114762' alt='' /></p>
                        <p>&nbsp;</p>
                        <h2 id="设计篇"><a href="javascript:void(0)" class="anchor">设计篇</a></h2>
                        <h3 id="自定义配置支持"><a href="javascript:void(0)" class="anchor">自定义配置支持</a></h3>
                        <p>基于Spring可扩展Schema提供自定义配置支持(spring配置文件中配置标签支持),在很多情况下,我们需要为系统提供可配置化支持,简单的做法可以直接基于Spring的标准Bean来配置,但配置较为复杂或者需要更多丰富控制的时候,会显得非常笨拙。一般的做法会用原生态的方式去解析定义好的xml文件,然后转化为配置对象,这种方式当然可以解决所有问题,但实现起来比较繁琐,特别是是在配置非常复杂的时候,解析工作是一个不得不考虑的负担。Spring提供了可扩展Schema的支持,这是一个不错的折中方案,完成一个自定义配置一般需要以下步骤：</p>
                        <p>1、编写一个JavaBean
                            2、编写XSD文件
                            3、编写NamespaceHandler和BeanDefinitionParser完成解析工作
                            4、编写spring.handlers和spring.schemas串联起所有部件
                            5、定义beans.xml</p>
                        <p>&nbsp;</p>
                        <p>下面举个例子</p>
                        <p>1)创建JavaBean</p>
                        <p>首先设计好配置项,通过JavaBean来建模,如类People</p>
                        <pre><code>public class People {this.s}<br/>
                            &nbsp;&nbsp;&nbsp;&nbsp;private&nbsp;String&nbsp;name;&nbsp;<br/>
                            &nbsp;&nbsp;&nbsp;&nbsp;private&nbsp;Integer&nbsp;age;<br/>
}<br/>
</code></pre>
                        <p>2)编写XSD文件</p>
                        <p>XSD文件是XML的结构化定义,Spring提供了可扩展的XSD,为上一步设计好的配置项编写XSD文件,people.xsd文件如下：</p>
                        <pre><code>&lt;?xml version=&quot;1.0&quot; encoding=&quot;UTF-8&quot;?&gt;<br/>
                            &lt;xsd:schema<br/>
	xmlns=&quot;http://blog.csdn.net/cutesource/schema/people&quot;<br/>
                            &nbsp;&nbsp;&nbsp;&nbsp;xmlns:xsd=&quot;http://www.w3.org/2001/XMLSchema&quot;&nbsp;	<br/>
                            &nbsp;&nbsp;&nbsp;&nbsp;xmlns:beans=&quot;http://www.springframework.org/schema/beans&quot;&nbsp;&nbsp;&nbsp;<br/>
                            &nbsp;&nbsp;&nbsp;&nbsp;targetNamespace=&quot;http://blog.csdn.net/418517226/schema/people&quot;&gt;<br/>
                            &lt;xsd:import&nbsp;namespace=&quot;http://www.springframework.org/schema/beans&quot;&nbsp;/&gt;<br/>
	<br/>
                            &nbsp;&nbsp;&lt;xsd:element&nbsp;name=&quot;people&quot;&gt;<br/>
                            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&lt;xsd:complexType&gt;<br/>
                            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&lt;xsd:complexContent&gt;<br/>
                            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&lt;xsd:extension&nbsp;base=&quot;beans:identifiedType&quot;&gt;<br/>
                            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&lt;xsd:attribute&nbsp;name=&quot;name&quot;&nbsp;type=&quot;xsd:string&quot;&nbsp;/&gt;<br/>
                            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&lt;xsd:attribute&nbsp;name=&quot;age&quot;&nbsp;type=&quot;xsd:int&quot;&nbsp;/&gt;<br/>
                            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&lt;/xsd:extension&gt;<br/>
                            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&lt;/xsd:complexContent&gt;<br/>
                            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&lt;/xsd:complexType&gt;<br/>
                            &nbsp;&nbsp;&lt;/xsd:element&gt;<br/>
                            &lt;/xsd:schema&gt;<br/>
</code></pre>
                        <p>&lt;xsd:element name="people">对应着配置项节点的名称,因此在应用中会用people作为节点名来引用这个配置</p>
                        <p>&lt;xsd:attribute name="name" type="xsd:string" />和&lt;xsd:attribute name="age" type="xsd:int" />对应着配置项people的两个属性名,因此在应用中可以配置name和age两个属性,分别是string和int类型。</p>
                        <p>完成后需把xsd文件放在classpath下,一般都放在META-INF目录下</p>
                        <p>关于xsd:schema的各个属性具体含义<a href='http://www.w3school.com.cn/schema/schema_schema.asp' target='_blank' >http://www.w3school.com.cn/schema/schema_schema.asp</a></p>
                        <p>&nbsp;</p>
                        <p>3)编写NamespaceHandler和BeanDefinitionParser完成解析工作</p>
                        <p>NamespaceHandler根据XSD文件具体的element找到某个BeanDefinitionParser,然后由BeanDefinitionParser完成具体的解析工作。因此需要分别完成 NamespaceHandler 和 BeanDefinitionParser 的实现类,Spring提供可默认实现类 NamespaceHandlerSupport 和AbstractSingleBeanDefinitionParser,简单的方式就是去继承这两个类,如下：</p>
                        <pre><code>public class MyNamespaceHandler extendsNamespaceHandlerSupport {this.s}<br/>
                            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;public&nbsp;void&nbsp;init()&nbsp;{this.s}<br/>
                            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;registerBeanDefinitionParser(&quot;people&quot;,&nbsp;newPeopleBeanDefinitionParser());<br/>
                            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;//people是一个element<br/>
                            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;}<br/>
}<br/>
</code></pre>
                        <p>其中registerBeanDefinitionParser(“people”, new PeopleBeanDefinitionParser()),就是用来把element和解析类联系起来,具体看下类PeopleBeanDefinitionParser：</p>
                        <pre><code>public class PeopleBeanDefinitionParser extendsAbstractSingleBeanDefinitionParser {this.s}<br/>
                            &nbsp;&nbsp;&nbsp;protected&nbsp;Class&nbsp;getBeanClass(Element&nbsp;element)&nbsp;{this.s}&nbsp;return&nbsp;People.class;}<br/>
                            &nbsp;&nbsp;&nbsp;protected&nbsp;void&nbsp;doParse(Element&nbsp;element,&nbsp;BeanDefinitionBuilder&nbsp;bean)&nbsp;{this.s}<br/>
                            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;String&nbsp;name=element.getAttribute(&quot;name&quot;);&nbsp;<br/>
                            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;String&nbsp;age&nbsp;=&nbsp;element.getAttribute(&quot;age&quot;);<br/>
                            &nbsp;&nbsp;&nbsp;if&nbsp;(StringUtils.hasText(name))&nbsp;{this.s}&nbsp;&nbsp;&nbsp;<br/>
                            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;bean.addPropertyValue(&quot;name&quot;,&nbsp;name);<br/>
                            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;}<br/>
                            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;if&nbsp;(StringUtils.hasText(age))&nbsp;{this.s}&nbsp;&nbsp;<br/>
			bean.addPropertyValue(&quot;age&quot;,&nbsp;&nbsp;Integer.valueOf(age))<br/>
                            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;}<br/>
                            &nbsp;&nbsp;&nbsp;}<br/>
}<br/>
</code></pre>
                        <p>4)编写 spring.handlers 和 spring.schemas 串联起所有部件</p>
                        <p>到目前为止,NamespaceHandler 与 xsd文件还没有联系,spring提供了spring.handlers 和 spring.schemas 这两个配置文件来完成这项工作,这两个文件需要我们自己编写并放入 META-INF 文件夹中, 这两个文件的地址必须是 META-INF/spring.handlers 和 META-INF/spring.schemas,spring会默认去载入它们。</p>
                        <p>下面是spring.handlers里面的内容：</p>
                        <p>http\://blog.csdn.net/cutesource/schema/people=xxx.xxx.MyNamespaceHandle以上表示当使用到名为&quot;<a href='http://blog.csdn.net/cutesource/schema/people' target='_blank' >http://blog.csdn.net/cutesource/schema/people</a>&quot;的schema引用时,会通过xxx.xxx.MyNamespaceHandler来完成解析</p>
                        <p>下面是spring.schemas：</p>
                        <p> http\://blog.csdn.net/cutesource/schema/people.xsd=META-INF/people.xsd</p>
                        <p>它表示载入xsd文件的地址。</p>
                        <p>5)定义beans.xml</p>
                        <p>使用方法和配置一个普通的bean 类似,只不过需要基于我们自定义schema,如下：</p>
                        <pre><code>&lt;beans xmlns=&quot;http://www.springframework.org/schema/beans&quot;<br/>
                            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;xmlns:xsi=&quot;http://www.w3.org/2001/XMLSchema-instance&quot;<br/>
                            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;xmlns:cutesource=&quot;http://blog.csdn.net/cutesource/schema/people&quot;<br/>
                            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;//schema引用,cutesource为标签头<br/>
                            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;xsi:schemaLocation=&quot;&nbsp;&nbsp;<br/>
                            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;http://www.springframework.org/schema/beans&nbsp;<br/>
                            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;http://www.springframework.org/schema/beans/spring-beans-2.5.xsd&nbsp;&nbsp;<br/>
                            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;http://blog.csdn.net/cutesource/schema/people&nbsp;<br/>
                            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;http://blog.csdn.net/cutesource/schema/people.xsd&quot;&gt;<br/>
                            &nbsp;&nbsp;&nbsp;&nbsp;&lt;cutesource:people&nbsp;id=&quot;cutesource&quot;&nbsp;name=&quot;svg&quot;&nbsp;age=&quot;27&quot;/&gt;<br/>
                            &lt;/beans&gt;<br/>
</code></pre>
                        <p>最后就可以在具体程序中使用基本的bean载入方式来载入我们的自定义配置对象了,如</p>
                        <pre><code>ApplicationContext ctx = new ClassPathXmlApplicationContext(&quot;beans.xml&quot;);  <br/>
People&nbsp;p&nbsp;=&nbsp;(People)ctx.getBean(&quot;cutesource&quot;);&nbsp;&nbsp;<br/>
System.out.println(p.getId());&nbsp;&nbsp;<br/>
System.out.println(p.getName());&nbsp;&nbsp;<br/>
System.out.println(p.getAge());&nbsp;<br/>
</code></pre>
                        <h3 id="Dubbo bean的加载"><a href="javascript:void(0)" class="anchor">Dubbo bean的加载</a></h3>
                        <p>从上一节《自定义配置支持》大楷能猜到dubbo bean的加载过程,这是一段服务提供者的配置片段。</p>
                        <p>在一个</p>
                        <pre><code>&lt;?xml version=&quot;1.0&quot; encoding=&quot;UTF-8&quot;?&gt;<br/>
                            &lt;beans&nbsp;xmlns=&quot;http://www.springframework.org/schema/beans&quot;<br/>
                            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;xmlns:xsi=&quot;http://www.w3.org/2001/XMLSchema-instance&quot;<br/>
                            &nbsp;xmlns:dubbo=&quot;http://code.alibabatech.com/schema/dubbo&quot;<br/>
                            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;xsi:schemaLocation=...&quot;&gt;<br/>
                            &lt;dubbo:service&nbsp;interface=&quot;com.lianlianpay.lli.entry.client.service.EntryChannelService&quot;&nbsp;ref=&quot;entryChannelService&quot;&nbsp;timeout=&quot;30000&quot;&nbsp;/&gt;<br/>
                            &lt;/beans&gt;<br/>
</code></pre>
                        <p>在dubbo-2.5.3.jar加载后,spring会载入其中的META-INF/spring.handlers 和 META-INF/spring.schemas文件,里面记录了xmlns:dubbo的解析hander为com.alibaba.dubbo.config.spring.schema.DubboNamespaceHandler,spring.schemas记录了对应的schema解析隐射文件dubbo.xsd。</p>
                        <pre><code>xxdeMacBook-Pro:META-INF xx$ ls<br/>
INDEX.LIST	MANIFEST.MF	assembly	dubbo		dubbo.xsd	maven		spring.handlers	spring.schemas<br/>
</code></pre>
                        <p>dubbo.xsd记录了各种标签对应的定义属性；</p>
                        <p>spring.handlers的内容：</p>
                        <pre><code>$ cat spring.handlers <br/>
http\://code.alibabatech.com/schema/dubbo=com.alibaba.dubbo.config.spring.schema.DubboNamespaceHandler<br/>
</code></pre>
                        <h3 id="NamespaceHandler"><a href="javascript:void(0)" class="anchor">NamespaceHandler</a></h3>
                        <pre><code>com.alibaba.dubbo.config.spring.schema.DubboNamespaceHandler<br/>
public&nbsp;class&nbsp;DubboNamespaceHandler&nbsp;extends&nbsp;NamespaceHandlerSupport&nbsp;{this.s}&nbsp;&nbsp;<br/>
                            &nbsp;&nbsp;&nbsp;&nbsp;public&nbsp;void&nbsp;init()&nbsp;{this.s}&nbsp;&nbsp;<br/>
                            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;//配置&lt;dubbo:application&gt;标签解析器<br/>
                            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;registerBeanDefinitionParser(&quot;application&quot;,&nbsp;new&nbsp;DubboBeanDefinitionParser(ApplicationConfig.class,&nbsp;true));&nbsp;&nbsp;<br/>
                            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;//配置&lt;dubbo:module&gt;标签解析器<br/>
                            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;registerBeanDefinitionParser(&quot;module&quot;,&nbsp;new&nbsp;DubboBeanDefinitionParser(ModuleConfig.class,&nbsp;true));&nbsp;&nbsp;<br/>
                            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;//配置&lt;dubbo:registry&gt;标签解析器<br/>
                            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;registerBeanDefinitionParser(&quot;registry&quot;,&nbsp;new&nbsp;DubboBeanDefinitionParser(RegistryConfig.class,&nbsp;true));&nbsp;&nbsp;<br/>
                            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;//配置&lt;dubbo:monitor&gt;标签解析器<br/>
                            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;registerBeanDefinitionParser(&quot;monitor&quot;,&nbsp;new&nbsp;DubboBeanDefinitionParser(MonitorConfig.class,&nbsp;true));&nbsp;&nbsp;<br/>
                            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;//配置&lt;dubbo:provider&gt;标签解析器<br/>
                            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;registerBeanDefinitionParser(&quot;provider&quot;,&nbsp;new&nbsp;DubboBeanDefinitionParser(ProviderConfig.class,&nbsp;true));&nbsp;&nbsp;<br/>
                            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;//配置&lt;dubbo:consumer&gt;标签解析器<br/>
                            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;registerBeanDefinitionParser(&quot;consumer&quot;,&nbsp;new&nbsp;DubboBeanDefinitionParser(ConsumerConfig.class,&nbsp;true));&nbsp;&nbsp;<br/>
                            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;//配置&lt;dubbo:protocol&gt;标签解析器<br/>
                            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;registerBeanDefinitionParser(&quot;protocol&quot;,&nbsp;new&nbsp;DubboBeanDefinitionParser(ProtocolConfig.class,&nbsp;true));&nbsp;&nbsp;<br/>
                            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;//配置&lt;dubbo:service&gt;标签解析器<br/>
                            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;registerBeanDefinitionParser(&quot;service&quot;,&nbsp;new&nbsp;DubboBeanDefinitionParser(ServiceBean.class,&nbsp;true));&nbsp;&nbsp;<br/>
                            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;//配置&lt;dubbo:refenrence&gt;标签解析器<br/>
                            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;registerBeanDefinitionParser(&quot;reference&quot;,&nbsp;new&nbsp;DubboBeanDefinitionParser(ReferenceBean.class,&nbsp;false));&nbsp;&nbsp;<br/>
                            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;//配置&lt;dubbo:annotation&gt;标签解析器<br/>
                            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;registerBeanDefinitionParser(&quot;annotation&quot;,&nbsp;new&nbsp;DubboBeanDefinitionParser(AnnotationBean.class,&nbsp;true));&nbsp;&nbsp;<br/>
                            &nbsp;&nbsp;&nbsp;&nbsp;}&nbsp;&nbsp;<br/>
                            &nbsp;}<br/>
</code></pre>
                        <p>从这里也可以看到,对应的支持的标签其实不多。所有的 Config 都封装到了DubboBeanDefinitionParser 中。对应的 class,就是传入的 beanClass。比如 application 的就是ApplicationConfig。 module 的就是 ModuleConfig。经过 Parser 的转换,provider.xml 中的配置就变成可以被使用的bean了。</p>
                        <h3 id="DubboBeanDefinitionParser"><a href="javascript:void(0)" class="anchor">DubboBeanDefinitionParser</a></h3>
                        <pre><code>public class DubboBeanDefinitionParser implements BeanDefinitionParser {this.s}<br/>
</code></pre>
                        <h2 id="Dubbo内核实现之SPI"><a href="javascript:void(0)" class="anchor">Dubbo内核实现之SPI</a></h2>
                        <p> 	Dubbo采用微内核+插件体系,使得设计优雅,扩展性强。那所谓的微内核+插件体系是如何实现的呢！大家是否熟悉spi(service  provider interface)机制,即我们定义了服务接口标准, jdk通过ServiceLoader类实现spi机制的服务查找功能。</p>
                        <h3 id="ServiceLoader"><a href="javascript:void(0)" class="anchor">ServiceLoader</a></h3>
                        <p>示例，首先定义一个接口：</p>
                        <pre><code>package com.example;  <br/>
public&nbsp;interface&nbsp;Spi&nbsp;{this.s}&nbsp;&nbsp;<br/>
                            &nbsp;&nbsp;&nbsp;String&nbsp;sayHello();&nbsp;&nbsp;<br/>
}<br/>
</code></pre>
                        <p>ServiceLoader会遍历所有jar查找META-INF/services/com.example.Spi文件,最后面就是 pacckage.interface的命名。</p>
                        <p>A厂商提供实现:</p>
                        <pre><code>package com.a.example;  <br/>
public&nbsp;class&nbsp;SpiAImpl&nbsp;implements&nbsp;Spi&nbsp;{this.s}&nbsp;&nbsp;<br/>
	public&nbsp;String&nbsp;syaHello()&nbsp;{this.s}&nbsp;&nbsp;<br/>
		return&nbsp;&quot;hello&nbsp;A&quot;&nbsp;;<br/>
</code></pre>
                        <p>在A厂商提供的a.jar包中的META-INF/services/com.example.Spi文件内容为：</p>
                        <pre><code>com.a.example.SpiAImpl        #厂商A的spi实现全路径类名<br/>
</code></pre>
                        <p>B厂商提供实现:</p>
                        <pre><code>public class SpiBImpl implements Spi {this.s}  <br/>
	public&nbsp;String&nbsp;syaHello()&nbsp;{this.s}&nbsp;&nbsp;<br/>
		return&nbsp;&quot;hello&nbsp;B&quot;;&nbsp;&nbsp;<br/>
	}&nbsp;&nbsp;<br/>
}<br/>
</code></pre>
                        <p>在B厂商提供的b.jar包中的META-INF/services/com.example.Spi文件内容为：</p>
                        <pre><code>com.a.example.SpiBImpl        #厂商B的spi实现全路径类名<br/>
</code></pre>
                        <p>ServiceLoader.load(Spi.class)读取厂商A、B提供jar包中的文件,ServiceLoader实现了Iterable接口可通过while for循环语句遍历出所有实现。</p>
                        <p>       注,可以在同一个com.example.Spi中写入多行实现,效果和Iterable一样</p>
                        <p><img src='https://gitee.com/nick070809/pics/raw/master/dubbo/1.png' alt='' /></p>
                        <p><strong>@SPI</strong></p>
                        <p>在dubbo代码中随处可见@spi注解,spi注解是对java spi的一种扩展,使得原来只支持META-INF/services目录下的接口定义文件可以扩展为META-INF/dubbo、META-INF/internal等</p>
                        <pre><code>@Documented  <br/>
@Retention(RetentionPolicy.RUNTIME)&nbsp;&nbsp;<br/>
@Target({this.s}ElementType.TYPE})&nbsp;&nbsp;<br/>
public&nbsp;@interface&nbsp;SPI&nbsp;{this.s}&nbsp;&nbsp;<br/>
                            &nbsp;&nbsp;&nbsp;&nbsp;String&nbsp;value()&nbsp;default&nbsp;&quot;&quot;;&nbsp;&nbsp;//缺省扩展点名<br/>
}<br/>
</code></pre>
                        <p>示例</p>
                        <pre><code>@SPI(&quot;dubbo&quot;)   //扩展点名字为dubbo<br/>
public&nbsp;interface&nbsp;Protocol&nbsp;{this.s}<br/>
                            &nbsp;&nbsp;&nbsp;&nbsp;int&nbsp;getDefaultPort();<br/>
	//暴露远程服务<br/>
                            &nbsp;&nbsp;&nbsp;&nbsp;@Adaptive<br/>
                            &lt;T&gt;&nbsp;Exporter&lt;T&gt;&nbsp;export(Invoker&lt;T&gt;&nbsp;invoker)&nbsp;throws&nbsp;RpcException;<br/>
	//引用远程服务<br/>
                            &nbsp;&nbsp;&nbsp;&nbsp;@Adaptive<br/>
                            &lt;T&gt;&nbsp;Invoker&lt;T&gt;&nbsp;refer(Class&lt;T&gt;&nbsp;type,&nbsp;URL&nbsp;url)&nbsp;throws&nbsp;RpcException;<br/>
                            &nbsp;&nbsp;&nbsp;&nbsp;void&nbsp;destroy();<br/>
}<br/>
</code></pre>
                        <p>Protocol的实现类</p>
                        <p><img src='https://gitee.com/nick070809/pics/raw/master/dubbo/2.png' alt='' /></p>
                        <p>发现有很多的实现类,是否有被spi管理的实现类呢?</p>
                        <p><img src='https://gitee.com/nick070809/pics/raw/master/dubbo/3.png' alt='' /></p>
                        <p>又如：</p>
                        <pre><code>@SPI(&quot;javassist&quot;)//可以知道默认使用key为javassist的动态编译实现。<br/>
public&nbsp;interface&nbsp;Compiler&nbsp;{this.s}<br/>
                            &nbsp;&nbsp;&nbsp;&nbsp;Class&lt;?&gt;&nbsp;compile(String&nbsp;code,&nbsp;ClassLoader&nbsp;classLoader);<br/>
}<br/>
</code></pre>
                        <p><img src='https://gitee.com/nick070809/pics/raw/master/dubbo/4.png' alt='' /></p>
                        <p>&nbsp;</p>
                        <h2 id="源码篇"><a href="javascript:void(0)" class="anchor">源码篇</a></h2>
                        <h3 id="ExtensionLoader[工厂模式]"><a href="javascript:void(0)" class="anchor">ExtensionLoader[工厂模式]</a></h3>
                        <pre><code>private static final Protocol protocol =ExtensionLoader.getExtensionLoader(Protocol.class).getAdaptiveExtension();  <br/>
</code></pre>
                        <p>Dubbo里有很多这种代码。这也是一种工厂模式，只是实现类的获取采用了 jdkspi的机制。这么实现的优点是可扩展性强，想要扩展实现，只需要在classpath下增加个文件就可以了，代码零侵入。另外，像上面的Adaptive实现，可以做到调用时动态决定调用哪个实现，但是由于这种实现采用了动态代理，会造成代码调试比较麻烦，需要分析出实际调用的实现类。</p>
                        <p>ExtensionLoader没有提供public的构造方法,但是提供了一个public static的getExtensionLoader,这个方法就是获取ExtensionLoader实例的工厂方法。</p>
                        <pre><code>public static &lt;T&gt; ExtensionLoader&lt;T&gt; getExtensionLoader(Class&lt;T&gt; type) {this.s}<br/>
                            &nbsp;&nbsp;&nbsp;&nbsp;if(!type.isInterface())&nbsp;{this.s}<br/>
                            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;throw&nbsp;ex;<br/>
                            &nbsp;&nbsp;&nbsp;&nbsp;}<br/>
                            &nbsp;&nbsp;&nbsp;&nbsp;if(!withExtensionAnnotation(type))&nbsp;{this.s}&nbsp;//&nbsp;只接受使用@SPI注解注释的接口类型<br/>
                            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;throw&nbsp;ex;<br/>
                            &nbsp;&nbsp;&nbsp;&nbsp;}<br/>
                            &nbsp;	//&nbsp;先从静态缓存中获取对应的ExtensionLoader实例&nbsp;&nbsp;EXTENSION_LOADERS&nbsp;=&nbsp;concurrentMap<br/>
                            &nbsp;&nbsp;&nbsp;&nbsp;ExtensionLoader&lt;T&gt;&nbsp;loader&nbsp;=&nbsp;(ExtensionLoader&lt;T&gt;)&nbsp;EXTENSION_LOADERS.get(type);<br/>
                            &nbsp;&nbsp;&nbsp;&nbsp;if&nbsp;(loader&nbsp;==&nbsp;null)&nbsp;{this.s}<br/>
                            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;EXTENSION_LOADERS.putIfAbsent(type,&nbsp;new&nbsp;ExtensionLoader&lt;T&gt;(type));<br/>
		//&nbsp;为Extension类型创建ExtensionLoader实例,并放入静态缓存<br/>
                            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;loader&nbsp;=&nbsp;(ExtensionLoader&lt;T&gt;)&nbsp;EXTENSION_LOADERS.get(type);<br/>
                            &nbsp;&nbsp;&nbsp;&nbsp;}<br/>
                            &nbsp;&nbsp;&nbsp;&nbsp;return&nbsp;loader;<br/>
}<br/>
</code></pre>
                        <p>new ExtensionLoader&lt;T>(type):</p>
                        <pre><code> private ExtensionLoader(Class&lt;?&gt; type) {this.s}<br/>
                            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;this.type&nbsp;=&nbsp;type;<br/>
                            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;objectFactory&nbsp;=&nbsp;(type&nbsp;==&nbsp;ExtensionFactory.class&nbsp;?&nbsp;null&nbsp;:&nbsp;ExtensionLoader.getExtensionLoader(ExtensionFactory.class).getAdaptiveExtension());<br/>
                            &nbsp;&nbsp;&nbsp;&nbsp;}<br/>
</code></pre>
                        <h4 id="ExtensionLoader.getExtension(type)"><a href="javascript:void(0)" class="anchor">ExtensionLoader.getExtension(type)</a></h4>
                        <p>根据名称获取当前扩展的指定实现</p>
                        <pre><code> public T getExtension(String name) {this.s}<br/>
                            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;if&nbsp;(&quot;true&quot;.equals(name))&nbsp;&nbsp;return&nbsp;getDefaultExtension();<br/>
                            &nbsp;&nbsp;<br/>
                            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Holder&lt;Object&gt;&nbsp;holder&nbsp;=&nbsp;cachedInstances.get(name);<br/>
                            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;if&nbsp;(holder&nbsp;==&nbsp;null)&nbsp;{this.s}<br/>
                            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;cachedInstances.putIfAbsent(name,&nbsp;new&nbsp;Holder&lt;Object&gt;());<br/>
                            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;holder&nbsp;=&nbsp;cachedInstances.get(name);<br/>
                            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;}<br/>
                            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Object&nbsp;instance&nbsp;=&nbsp;holder.get();<br/>
                            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;if&nbsp;(instance&nbsp;==&nbsp;null)&nbsp;{this.s}<br/>
                            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;synchronized&nbsp;(holder)&nbsp;{this.s}<br/>
                            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;instance&nbsp;=&nbsp;holder.get();<br/>
                            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;if&nbsp;(instance&nbsp;==&nbsp;null)&nbsp;{this.s}<br/>
                            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;instance&nbsp;=&nbsp;createExtension(name);<br/>
                            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;holder.set(instance);<br/>
                            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;}<br/>
                            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;}<br/>
                            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;}<br/>
                            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;return&nbsp;(T)&nbsp;instance;<br/>
                            &nbsp;&nbsp;&nbsp;&nbsp;}<br/>
                            &nbsp;&nbsp;&nbsp;&nbsp;<br/>
                            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;private&nbsp;T&nbsp;createExtension(String&nbsp;name)&nbsp;{this.s}<br/>
                            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Class&lt;?&gt;&nbsp;clazz&nbsp;=&nbsp;getExtensionClasses().get(name);<br/>
                            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;//构造一个实例<br/>
                            &nbsp;&nbsp;&nbsp;&nbsp;}<br/>
</code></pre>
                        <h4 id="ExtensionLoader.getActivateExtension(type)"><a href="javascript:void(0)" class="anchor">ExtensionLoader.getActivateExtension(type)</a></h4>
                        <p>根据条件获取当前扩展可自动激活的实现 </p>
                        <h4 id="ExtensionLoader.getAdaptiveExtension(type)"><a href="javascript:void(0)" class="anchor">ExtensionLoader.getAdaptiveExtension(type)</a></h4>
                        <p>获取当前扩展的自适应实现</p>
                        <h3 id="AdaptiveExtensionFactory"><a href="javascript:void(0)" class="anchor">AdaptiveExtensionFactory</a></h3>
                        <p>从上面的代码来看,如果传入的参数为ExtensionFactory类型的,objectFactory会设置为null,否则getAdaptiveExtension();ExtensionFactory objectFactory主要用于加载扩展的实现</p>
                        <p><img src='https://gitee.com/nick070809/pics/raw/master/dubbo/5.png' alt='' /></p>
                        <p>默认的ExtensionFactory实现中,AdaptiveExtensionFactotry被@Adaptive注解注释,也就是它就是ExtensionFactory对应的自适应扩展实现(每个扩展点最多只能有一个自适应实现,如果所有实现中没有被@Adaptive注释的,那么dubbo会动态生成一个自适应实现类),也就是说,所有对ExtensionFactory调用的地方,实际上调用的都是AdpativeExtensionFactory,当于一个代理入口,他会遍历当前系统中所有的ExtensionFactory实现来获取指定的扩展实现,获取到扩展实现或遍历完所有的ExtensionFactory实现。这里调用了ExtensionLoader的getSupportedExtensions方法来获取ExtensionFactory的所有实现,又回到了ExtensionLoader类,下面我们就来分析ExtensionLoader的几个重要的实例方法。</p>
                        <p>&nbsp;</p>
                        <p>其public成员方法中有三个比较重要的方法：</p>
                        <p>	getActivateExtension ：根据条件获取当前扩展可自动激活的实现</p>
                        <p>	getExtension ：根据名称获取当前扩展的指定实现</p>
                        <p>	getAdaptiveExtension : 获取当前扩展的自适应实现</p>
                        <p>	这三个方法将会是我们重点关注的方法；*每一个ExtensionLoader实例仅负责加载特定SPI扩展的实现。因此想要获取某个扩展的实现,首先要获取到该扩展对应的ExtensionLoader实例。</p>
                        <p>&nbsp;</p>
                        <h3 id="服务发布"><a href="javascript:void(0)" class="anchor">服务发布</a></h3>
                        <p>服务发布是服务提供方向注册中注册服务过程，以便服务消费者从注册中心查阅并调用服务。</p>
                        <p>服务发布方在spring的配置文件中配置如下：</p>
                        <p><bean id="demoService"class="com.alibaba.dubbo.demo.provider.DemoServiceImpl" /></p>
                        <p>上面是在spring中配置的服务的具体实现，是spring中的一个普通的bean</p>
                        <p>&lt;dubbo:service interface="com.alibaba.dubbo.demo.DemoService" ref=”demoService”/></p>
                    <p>上面的配置spring容器在启动的过程中会解析自定义的schema元素dubbo转换成实际的配置实现ServiceBean ，并把服务暴露出去。</p>
                    <p>从dubbo bean的加载中知道,这个<a href='dubbo:service' target='_blank' >dubbo:service</a>会被封装为一个ServiceBean</p>
                    <p>registerBeanDefinitionParser(&quot;service&quot;, new DubboBeanDefinitionParser(ServiceBean.class, true));</p>
                    <p><img src='https://gitee.com/nick070809/pics/raw/master/dubbo/6.png' alt='' /></p>
                    <p>ServiceBean是一个InitializingBean,在afterPropertiesSet时通过配置信息引导服务绑定和注册。</p>
                    <p>ServiceBean还实现了ApplicationListener,在全部spring bean加载完成后判断是否延迟加载的逻辑。</p>
                    <p>ServiceBean也实现了ApplicationContextAware,复写了setApplicationContext方法,添加容器的管理。</p>
                    <p>ServiceConfig,做为服务配置管理和配置信息校验。</p>
                    <p>&nbsp;</p>
                    <h3 id="spring各个启动方法执行顺序："><a href="javascript:void(0)" class="anchor">spring各个启动方法执行顺序：</a></h3>
                    <p>constructor,@PostConstruct,afterPropertiesSet,onApplicationEvent, init-method执行顺序</p>
                    <p>执行结果：</p>
                    <pre><code>----&gt; InitSequenceBean: constructor: <br/>
----&gt;&nbsp;InitSequenceBean:&nbsp;postConstruct:&nbsp;<br/>
----&gt;&nbsp;InitSequenceBean:&nbsp;afterPropertiesSet:&nbsp;<br/>
----&gt;&nbsp;InitSequenceBean:&nbsp;init:&nbsp;<br/>
----&gt;&nbsp;InitSequenceBean:&nbsp;onApplicationEvent<br/>
----&gt;&nbsp;InitSequenceBean:&nbsp;constructor:&nbsp;<br/>
----&gt;&nbsp;InitSequenceBean:&nbsp;afterPropertiesSet:&nbsp;<br/>
----&gt;&nbsp;InitSequenceBean:&nbsp;init:&nbsp;<br/>
----&gt;&nbsp;InitSequenceBean:&nbsp;onApplicationEvent<br/>
</code></pre>
                    <p>分析：</p>
                    <p>构造函数是每个类最先执行的,这个时候,bean属性还没有被注入</p>
                    <p>postConstruct优先于afterPropertiesSet执行</p>
                    <p>spring很多组建的初始化都放在afterPropertiesSet做。我们在做一些中间件想和spring一起启动,可以放在这里启动。</p>
                    <p>onApplicationEvent属于应用层的时间,最后被执行,很容易理解。注意,它出现了两次,为什么？因为bean注入了DemoService,spring容器会被刷新。</p>
                    <p>换言之onApplicationEvent会被频繁执行,需要使用它监听,需要考虑性能问题。</p>
                    <p>&nbsp;</p>
                    <h3 id="RegistryProtocol"><a href="javascript:void(0)" class="anchor">RegistryProtocol</a></h3>
                    <p>&lt;dubbo:registry protocol="zookeeper" address="${this.s}dubbo.registry.address}" /></p>
                    <pre><code>public static RegistryProtocol getRegistryProtocol() {this.s}<br/>
	...<br/>
                        &nbsp;&nbsp;&nbsp;&nbsp;return&nbsp;ExtensionLoader.getExtensionLoader(Protocol.class).getExtension(Constants.REGISTRY_PROTOCO&nbsp;<br/>
}&nbsp;//REGISTRY_PROTOCO&nbsp;=&quot;registry&quot;;<br/>
</code></pre>
                    <p>RegistryFactory:</p>
                    <pre><code>private RegistryFactory registryFactory;<br/>
public&nbsp;void&nbsp;setRegistryFactory(RegistryFactory&nbsp;registryFactory)&nbsp;{this.s}<br/>
                        &nbsp;&nbsp;&nbsp;&nbsp;this.registryFactory&nbsp;=&nbsp;registryFactory;<br/>
}<br/>
public&nbsp;void&nbsp;register(URL&nbsp;registryUrl,&nbsp;URL&nbsp;registedProviderUrl)&nbsp;{this.s}<br/>
                        &nbsp;&nbsp;&nbsp;&nbsp;Registry&nbsp;registry&nbsp;=&nbsp;registryFactory.getRegistry(registryUrl);<br/>
                        &nbsp;&nbsp;&nbsp;&nbsp;registry.register(registedProviderUrl);<br/>
}<br/>
</code></pre>
                    <p><img src='https://gitee.com/nick070809/pics/raw/master/dubbo/7.png' alt='' /></p>
                    <p>通过传入的registryFactory，解析registryUrl来获取不同的Registry,可能是ZookeeperRegistry，然后调用register方法进行注册，在ZookeeperRegistry中会调用ZookeeperClient.create方法来完成注册。</p>
                    <h3 id="DubboProtocol暴露服务的过程"><a href="javascript:void(0)" class="anchor">DubboProtocol暴露服务的过程</a></h3>
                    <p>&lt;dubbo:protocol name="${this.s}dubbo.protocol.name}" port="${this.s}dubbo.protocol.port}" /></p>
                    <pre><code>  public static DubboProtocol getDubboProtocol() {this.s}<br/>
                        &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;return&nbsp;ExtensionLoader.getExtensionLoader(Protocol.class).getExtension(DubboProtocol.NAME);<br/>
                        &nbsp;&nbsp;&nbsp;&nbsp;}//DubboProtocol.NAME&nbsp;=&quot;dubbo&quot;<br/>
</code></pre>
                    <p>暴露给注册中心：</p>
                    <pre><code> public &lt;T&gt; Exporter&lt;T&gt; export(Invoker&lt;T&gt; invoker) throws RpcException {this.s}<br/>
                        &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;URL&nbsp;url&nbsp;=&nbsp;invoker.getUrl();<br/>
                        &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;DubboExporter&lt;T&gt;&nbsp;exporter&nbsp;=&nbsp;new&nbsp;DubboExporter&lt;T&gt;(invoker,&nbsp;key,&nbsp;exporterMap);<br/>
                        &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;exporterMap.put(key,&nbsp;exporter);<br/>
                        &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;openServer(url);<br/>
                        &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;optimizeSerialization(url);<br/>
                        &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;return&nbsp;exporter;<br/>
                        &nbsp;&nbsp;&nbsp;&nbsp;}<br/>
</code></pre>
                    <p>获取invoker:</p>
                    <pre><code> exporterMap = new ConcurrentHashMap&lt;String, Exporter&lt;?&gt;&gt;();<br/>
                        &nbsp;Invoker&lt;?&gt;&nbsp;getInvoker(Channel&nbsp;channel,&nbsp;Invocation&nbsp;inv)&nbsp;throws&nbsp;RemotingException&nbsp;{this.s}<br/>
                        &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;DubboExporter&lt;?&gt;&nbsp;exporter&nbsp;=&nbsp;(DubboExporter&lt;?&gt;)&nbsp;exporterMap.get(serviceKey);<br/>
                        &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;return&nbsp;exporter.getInvoker();<br/>
                        &nbsp;&nbsp;&nbsp;&nbsp;}<br/>
</code></pre>
                    <p>invoker是在服务暴露时创建的：</p>
                    <p>如：</p>
                    <pre><code>Exporter&lt;HessianService&gt; exporter = protocol.export(proxyFactory.getInvoker(server, HessianService.class, url));<br/>
</code></pre>
                    <p>&nbsp;</p>
                    <p>&nbsp;</p>
                    <h3 id="dubbo-remote"><a href="javascript:void(0)" class="anchor">dubbo-remote</a></h3>
                    <p><img src='https://gitee.com/nick070809/pics/raw/master/dubbo/8.png' alt='' /></p>
                    <h3 id="dubbo-rpc"><a href="javascript:void(0)" class="anchor">dubbo-rpc</a></h3>
                    <p><img src='https://gitee.com/nick070809/pics/raw/master/dubbo/9.png' alt='' /></p>
                    <h3 id="Proxy"><a href="javascript:void(0)" class="anchor">Proxy</a></h3>
                    <pre><code>|-dubbo-rpc<br/>
                        &nbsp;&nbsp;&nbsp;&nbsp;|-dubbo-rpc-api<br/>
                        &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;|-proxy<br/>
                        &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;	|-JavassistProxyFactory<br/>
                        &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;	|-JdkProxyFactory<br/>
                        &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;|-protocol<br/>
                        &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;	|-AbstractProtocol<br/>
                        &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;		|--DubboProtocol<br/>
                        &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;		|--HttpProtocol<br/>
                        &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;		|--&nbsp;...<br/>
                        &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;|-filter<br/>
                        &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;|-listener<br/>
                        &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;|-Invoker<br/>
</code></pre>
                    <p>JavassistProxyFactory:</p>
                    <pre><code>public class JavassistProxyFactory extends AbstractProxyFactory {this.s}<br/>
                        &nbsp;&nbsp;&nbsp;&nbsp;public&nbsp;&lt;T&gt;&nbsp;T&nbsp;getProxy(Invoker&lt;T&gt;&nbsp;invoker,&nbsp;Class&lt;?&gt;[]&nbsp;interfaces)&nbsp;{this.s}<br/>
                        &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;return&nbsp;(T)&nbsp;Proxy.getProxy(interfaces).newInstance(new&nbsp;InvokerInvocationHandler(invoker));<br/>
                        &nbsp;&nbsp;&nbsp;&nbsp;}<br/>
                        &nbsp;&nbsp;&nbsp;&nbsp;public&nbsp;&lt;T&gt;&nbsp;Invoker&lt;T&gt;&nbsp;getInvoker(T&nbsp;proxy,&nbsp;Class&lt;T&gt;&nbsp;type,&nbsp;URL&nbsp;url)&nbsp;{this.s}<br/>
                        &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;final&nbsp;Wrapper&nbsp;wrapper&nbsp;=&nbsp;Wrapper.getWrapper(proxy.getClass().getName().indexOf(&#39;$&#39;)&nbsp;&lt;&nbsp;0&nbsp;?&nbsp;proxy.getClass()&nbsp;:&nbsp;type);<br/>
                        &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;return&nbsp;new&nbsp;AbstractProxyInvoker&lt;T&gt;(proxy,&nbsp;type,&nbsp;url)&nbsp;{this.s}<br/>
                        &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;@Override<br/>
                        &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;protected&nbsp;Object&nbsp;doInvoke(T&nbsp;proxy,&nbsp;String&nbsp;methodName,<br/>
                        &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Class&lt;?&gt;[]&nbsp;parameterTypes,<br/>
                        &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Object[]&nbsp;arguments)&nbsp;throws&nbsp;Throwable&nbsp;{this.s}<br/>
                        &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;return&nbsp;wrapper.invokeMethod(proxy,&nbsp;methodName,&nbsp;parameterTypes,&nbsp;arguments);<br/>
                        &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;}<br/>
                        &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;};<br/>
                        &nbsp;&nbsp;&nbsp;&nbsp;}<br/>
}<br/>
</code></pre>
                    <p>服务代理层（Proxy）：对服务接口进行透明代理，<strong>生成服务的客户端代理和服务器端代理</strong>，使服务的远程调用就像在本地调用一样。<strong>默认使用JavassistProxyFactory，返回一个Invoker，Invoker则是个可执行核心实体，Invoker的invoke方法通过反射执行service方法。</strong></p>
                    <p>远程调用层（Protocol）：封装RPC调用，provider通过export方法进行暴露服务，consumer通过refer方法调用服务。而Protocol依赖的是Invoker。通过上面说的Proxy获得的Invoker，包装成Exporter</p>
                    <h3 id="Invoker："><a href="javascript:void(0)" class="anchor">Invoker：</a></h3>
                    <pre><code>public interface Invoker&lt;T&gt; extends Node {this.s}<br/>
                        &nbsp;&nbsp;&nbsp;&nbsp;Class&lt;T&gt;&nbsp;getInterface();<br/>
                        &nbsp;&nbsp;&nbsp;&nbsp;Result&nbsp;invoke(Invocation&nbsp;invocation)&nbsp;throws&nbsp;RpcException;<br/>
}<br/>
</code></pre>
                    <h3 id="ServiceBean"><a href="javascript:void(0)" class="anchor">ServiceBean</a></h3>
                    <pre><code>|-dubbo-config<br/>
                        &nbsp;&nbsp;&nbsp;&nbsp;|-dubbo-config-api<br/>
                        &nbsp;&nbsp;&nbsp;&nbsp;	|-ServiceConfig<br/>
                        &nbsp;&nbsp;&nbsp;&nbsp;	|-RegistryConfig<br/>
                        &nbsp;&nbsp;&nbsp;&nbsp;	|-ProviderConfig<br/>
                        &nbsp;&nbsp;&nbsp;&nbsp;	|-ProtocolConfig<br/>
                        &nbsp;&nbsp;&nbsp;&nbsp;	|-MonitorConfig<br/>
                        &nbsp;&nbsp;&nbsp;&nbsp;	|-ConsumerConfig<br/>
                        &nbsp;&nbsp;&nbsp;&nbsp;	|-ServiceConfig<br/>
                        &nbsp;&nbsp;&nbsp;&nbsp;|-dubbo-config-spring<br/>
                        &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;|-ServiceBean<br/>
                        &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;|-ReferenceBean&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<br/>
</code></pre>
                    <p>前面讲过每个标签都会解析成一个ServiceBean，在ServiceBean的onApplicationEvent和afterPropertiesSet方法中，都含有export方法，也就是说，每一个ServiceBean都会进行暴露；</p>
                    <pre><code>public void onApplicationEvent(ContextRefreshedEvent event) {this.s}<br/>
                        &nbsp;&nbsp;&nbsp;&nbsp;if&nbsp;(isDelay()&nbsp;&amp;&amp;&nbsp;!isExported()&nbsp;&amp;&amp;&nbsp;!isUnexported())&nbsp;{this.s}<br/>
                        &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;export();<br/>
                        &nbsp;&nbsp;&nbsp;&nbsp;}<br/>
}<br/>
public&nbsp;void&nbsp;afterPropertiesSet()&nbsp;throws&nbsp;Exception&nbsp;{this.s}<br/>
                        &nbsp;&nbsp;&nbsp;&nbsp;getProvider();&nbsp;&nbsp;//伪代码<br/>
                        &nbsp;&nbsp;&nbsp;&nbsp;getApplication();<br/>
                        &nbsp;&nbsp;&nbsp;&nbsp;getModule();<br/>
                        &nbsp;&nbsp;&nbsp;&nbsp;getRegistries();<br/>
                        &nbsp;&nbsp;&nbsp;&nbsp;getMonitor()<br/>
                        &nbsp;&nbsp;&nbsp;&nbsp;getProtocols();<br/>
                        &nbsp;&nbsp;&nbsp;&nbsp;getBeanName();<br/>
                        &nbsp;&nbsp;&nbsp;&nbsp;if&nbsp;(!isDelay())&nbsp;export&nbsp;&nbsp;();<br/>
}<br/>
</code></pre>
                    <p>执行export在父类ServiceConfig中：</p>
                    <pre><code>public synchronized void export() {this.s}<br/>
                        &nbsp;&nbsp;&nbsp;&nbsp;if&nbsp;(delay&nbsp;!=&nbsp;null&nbsp;&amp;&amp;&nbsp;delay&nbsp;&gt;&nbsp;0)&nbsp;{this.s}<br/>
                        &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;delayExportExecutor.schedule(new&nbsp;Runnable()&nbsp;{this.s}<br/>
                        &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;public&nbsp;void&nbsp;run()&nbsp;{this.s}<br/>
                        &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;doExport();&nbsp;&nbsp;//延迟暴露<br/>
                        &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;}<br/>
                        &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;},&nbsp;delay,&nbsp;TimeUnit.MILLISECONDS);<br/>
                        &nbsp;&nbsp;&nbsp;&nbsp;}&nbsp;else&nbsp;{this.s}<br/>
                        &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;doExport();<br/>
                        &nbsp;&nbsp;&nbsp;&nbsp;}<br/>
}<br/>
protected&nbsp;synchronized&nbsp;void&nbsp;doExport()&nbsp;{this.s}<br/>
                        &nbsp;&nbsp;&nbsp;&nbsp;...<br/>
                        &nbsp;&nbsp;&nbsp;&nbsp;doExportUrls();<br/>
                        &nbsp;&nbsp;&nbsp;&nbsp;...<br/>
}<br/>
private&nbsp;void&nbsp;doExportUrls()&nbsp;{this.s}<br/>
                        &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;//该方法根据配置文件装配成一个注册地URL的list<br/>
                        &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;List&lt;URL&gt;&nbsp;registryURLs&nbsp;=&nbsp;loadRegistries(true);<br/>
                        &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;//根据每一个协议配置来分别暴露服务<br/>
                        &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;for&nbsp;(ProtocolConfig&nbsp;protocolConfig&nbsp;:&nbsp;protocols)&nbsp;{this.s}<br/>
                        &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;doExportUrlsFor1Protocol(protocolConfig,&nbsp;registryURLs);<br/>
                        &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;}<br/>
                        &nbsp;&nbsp;&nbsp;&nbsp;}<br/>
</code></pre>
                    <p>这个protocols长这个样子&lt;dubbo:protocol name="dubbo" port="20888" id="dubbo" /> protocols也是根据配置装配出来的。接下来让我们进入doExportUrlsFor1Protocol方法看看dubbo具体是怎么样将服务暴露出去的。这个方法特别大，有将近300多行代码，但是其中大部分都是获取类似protocols的name、port、host和一些必要的上下文，代码太长就不全都贴出来了，只贴关键部分。</p>
                    <pre><code>public void setRef(T ref) {this.s}<br/>
                        &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;this.ref&nbsp;=&nbsp;ref;<br/>
                        &nbsp;&nbsp;}<br/>
private&nbsp;void&nbsp;doExportUrlsFor1Protocol(ProtocolConfig&nbsp;protocolConfig,&nbsp;List&lt;URL&gt;&nbsp;registryURLs)&nbsp;{this.s}&nbsp;<br/>
...<br/>
//通过interfaceClass获取要暴露服务的所有要暴露的方法<br/>
String[]&nbsp;methods&nbsp;=&nbsp;Wrapper.getWrapper(interfaceClass).getMethodNames();<br/>
...<br/>
//根据上下文创建URL对象<br/>
                        &nbsp;URL&nbsp;url&nbsp;=&nbsp;new&nbsp;URL(name,&nbsp;host,&nbsp;port,&nbsp;(contextPath&nbsp;==&nbsp;null&nbsp;||&nbsp;contextPath.length()&nbsp;==&nbsp;0&nbsp;?&nbsp;&quot;&quot;&nbsp;:&nbsp;contextPath&nbsp;+&nbsp;&quot;/&quot;)&nbsp;+&nbsp;path,&nbsp;map);<br/>
//通过proxyFactory来获取Invoker对象<br/>
                        &nbsp;Invoker&lt;?&gt;&nbsp;invoker&nbsp;=&nbsp;proxyFactory.getInvoker(ref,&nbsp;(Class)&nbsp;interfaceClass,&nbsp;registryURL.addParameterAndEncoded(Constants.EXPORT_KEY,&nbsp;url.toFullString()));<br/>
//将invoker对象在protocol中封装成Exporter方便提供给信息交换层进行网络传输<br/>
                        &nbsp;Exporter&lt;?&gt;&nbsp;exporter&nbsp;=&nbsp;protocol.export(invoker);<br/>
                        &nbsp;//将exporter添加到list中<br/>
                        &nbsp;exporters.add(exporter);<br/>
</code></pre>
                    <p>看到这里就比较明白dubbo的工作原理了doExportUrlsFor1Protocol方法，先创建URL，URL创建出来长这样dubbo://192.168.xx.63:20888/com.xxx.xxx.VehicleInfoService?anyhost=true&amp;application=test-web&amp;default.retries=0&amp;dubbo=2.5.3&amp;interface=com.xxx.xxx.VehicleInfoService&amp;methods=get,save,update,del,list&amp;pid=13168&amp;revision=1.2.38&amp;side=provider&amp;timeout=5000&amp;timestamp=1510829644847;</p>
                    <p>是不是觉得这个URL很眼熟，没错在注册中心看到的services的providers信息就是这个，再传入url通过proxyFactory获取Invoker，再将Invoker封装成Exporter的数组，只需要将这个list提供给网络传输层组件，然后consumer执行Invoker的invoke方法就行了。让我们再看看这个proxyFactory的getInvoker方法。proxyFactory下有JDKProxyFactory和JavassistProxyFactory。官方推荐也是默认使用的是JavassistProxyFactory。因为javassist动态代理性能比JDK的高。</p>
                    <p>&nbsp;</p>
                    <p>在前面的Invoker中有两个方法，一个getInterface，也就是要暴露的服务接口，一个就是invoke方法，这个invoke方法在AbstractProxyInvoker中是这样的：</p>
                    <pre><code>public Result invoke(Invocation invocation) throws RpcException {this.s}<br/>
                        &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;try&nbsp;{this.s}<br/>
                        &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;//调用doInvoke方法，返回一个Result<br/>
                        &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;return&nbsp;new&nbsp;RpcResult(doInvoke(proxy,&nbsp;invocation.getMethodName(),&nbsp;invocation.getParameterTypes(),&nbsp;invocation.getArguments()));<br/>
                        &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;}&nbsp;catch&nbsp;(InvocationTargetException&nbsp;e)&nbsp;{this.s}<br/>
                        &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;return&nbsp;new&nbsp;RpcResult(e.getTargetException());<br/>
                        &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;}&nbsp;catch&nbsp;(Throwable&nbsp;e)&nbsp;{this.s}<br/>
                        &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;...<br/>
                        &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;}<br/>
                        &nbsp;&nbsp;&nbsp;&nbsp;}<br/>
</code></pre>
                    <p><img src='https://gitee.com/nick070809/pics/raw/master/dubbo/10.png' alt='' /></p>

                    </Col>
                    <Col span={1}>
                    </Col>
                    <Col span={4}>
                        <Anchor showInkInFixed="true">
                            <Link href="#Dubbo源码的结构概述" title="Dubbo源码的结构概述"/>
                                <Link href="#设计篇" title="设计篇">
                                <Link href="#自定义配置支持" title="自定义配置支持"/>
                                <Link href="#Dubbo bean的加载" title="Dubbo bean的加载"/>
                                <Link href="#NamespaceHandler" title="NamespaceHandler"/>
                                <Link href="#DubboBeanDefinitionParser" title="DubboBeanDefinitionParser"/>
                        </Link>
                                <Link href="#Dubbo内核实现之SPI" title="Dubbo内核实现之SPI">
                                <Link href="#ServiceLoader" title="ServiceLoader"/>
                        </Link>
                            <Link href="#源码篇" title="源码篇">
                                <Link href="#ExtensionLoader[工厂模式]" title="ExtensionLoader[工厂模式]">
                                <Link href="#ExtensionLoader.getExtension(type)" title="ExtensionLoader.getExtension(type)"/>
                                <Link href="#ExtensionLoader.getActivateExtension(type)" title="ExtensionLoader.getActivateExtension(type)"/>
                                <Link href="#ExtensionLoader.getAdaptiveExtension(type)" title="ExtensionLoader.getAdaptiveExtension(type)"/>
                        </Link>
                                <Link href="#AdaptiveExtensionFactory" title="AdaptiveExtensionFactory"/>
                                <Link href="#服务发布" title="服务发布"/>
                                <Link href="#spring各个启动方法执行顺序：" title="spring各个启动方法执行顺序："/>
                                <Link href="#RegistryProtocol" title="RegistryProtocol"/>
                                <Link href="#DubboProtocol暴露服务的过程" title="DubboProtocol暴露服务的过程"/>
                                <Link href="#dubbo-remote" title="dubbo-remote"/>
                                <Link href="#dubbo-rpc" title="dubbo-rpc"/>
                                <Link href="#Proxy" title="Proxy"/>
                                <Link href="#Invoker：" title="Invoker："/>
                                <Link href="#ServiceBean" title="ServiceBean"/>
                        </Link>
                        </Anchor>
                    </Col>
                </Row>


            </div>

        );
    }
}

export default Dubbo3;
