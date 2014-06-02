<?xml version="1.0"?>
<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform">
  <xsl:output method="html" encoding="utf-8" indent="yes" />

	<xsl:template match="/">
		<xsl:apply-templates select="//box[position() mod 3 = 1][@event = 'mean']"/> 
	</xsl:template>	

	<xsl:template match="box">
		<div class="row">
				<xsl:for-each select=".|following-sibling::*[not(position() > 2)]">
	            	<xsl:call-template name="box"/>
        		</xsl:for-each> 
		</div>
	</xsl:template>

	<xsl:template name="box"> 
		<div class="col-sm-6 col-md-4">
			<div class="thumbnail">
				<img alt="{@name}" style="width: 300px; height: 200px;" src="{@img}" />
				<div class="caption">
				  <h3><xsl:value-of select="./@name"/></h3>
				  <xsl:value-of select="." disable-output-escaping="yes" />
				</div>
			</div>
		</div>
	</xsl:template>
</xsl:stylesheet>