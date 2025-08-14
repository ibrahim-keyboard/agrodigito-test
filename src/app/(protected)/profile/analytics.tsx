import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import { useRouter, Stack } from 'expo-router';
import {
  AntDesign,
  FontAwesome,
  MaterialCommunityIcons,
  MaterialIcons,
} from '@expo/vector-icons';

import { Colors } from '@/constants/Colors';
import { Typography } from '@/constants/Typography';
import Card from '@/components/Card';

const { width } = Dimensions.get('window');

export default function PurchaseAnalyticsScreen() {
  const router = useRouter();
  const [selectedPeriod, setSelectedPeriod] = useState('6months');

  const periods = [
    { id: '1month', label: 'Last Month' },
    { id: '3months', label: 'Last 3 Months' },
    { id: '6months', label: 'Last 6 Months' },
    { id: '1year', label: 'Last Year' },
  ];

  const stats = {
    totalSpent: 45680,
    totalOrders: 24,
    averageOrder: 1903,
    savedAmount: 5420,
  };

  const categorySpending = [
    {
      name: 'Seeds',
      amount: 18500,
      percentage: 40.5,
      color: Colors.primary[500],
    },
    {
      name: 'Fertilizers',
      amount: 12300,
      percentage: 26.9,
      color: Colors.secondary[500],
    },
    {
      name: 'Equipment',
      amount: 8900,
      percentage: 19.5,
      color: Colors.accent[500],
    },
    {
      name: 'Pesticides',
      amount: 4200,
      percentage: 9.2,
      color: Colors.success[500],
    },
    {
      name: 'Others',
      amount: 1780,
      percentage: 3.9,
      color: Colors.warning[500],
    },
  ];

  const monthlyData = [
    { month: 'Jan', amount: 3200 },
    { month: 'Feb', amount: 4100 },
    { month: 'Mar', amount: 2800 },
    { month: 'Apr', amount: 5200 },
    { month: 'May', amount: 6800 },
    { month: 'Jun', amount: 4500 },
  ];

  const maxAmount = Math.max(...monthlyData.map((item) => item.amount));

  const renderStatCard = (
    title: string,
    value: string,
    icon: React.ReactNode,
    trend?: string
  ) => (
    <Card style={styles.statCard}>
      <View style={styles.statHeader}>
        <View style={styles.statIconContainer}>{icon}</View>
        {trend && (
          <View style={styles.trendContainer}>
            <MaterialIcons
              name='trending-up'
              size={12}
              color={Colors.success[500]}
            />
            <Text style={styles.trendText}>{trend}</Text>
          </View>
        )}
      </View>
      <Text style={styles.statValue}>{value}</Text>
      <Text style={styles.statTitle}>{title}</Text>
    </Card>
  );

  const renderCategoryItem = (item: (typeof categorySpending)[0]) => (
    <View key={item.name} style={styles.categoryItem}>
      <View style={styles.categoryInfo}>
        <View style={[styles.categoryColor, { backgroundColor: item.color }]} />
        <Text style={styles.categoryName}>{item.name}</Text>
      </View>
      <View style={styles.categoryStats}>
        <Text style={styles.categoryAmount}>
          ₹{item.amount.toLocaleString()}
        </Text>
        <Text style={styles.categoryPercentage}>{item.percentage}%</Text>
      </View>
    </View>
  );

  const renderBarChart = () => (
    <View style={styles.chartContainer}>
      <Text style={styles.chartTitle}>Monthly Spending Trend</Text>
      <View style={styles.chart}>
        {monthlyData.map((item, index) => (
          <View key={index} style={styles.barContainer}>
            <View style={styles.barWrapper}>
              <View
                style={[
                  styles.bar,
                  {
                    height: (item.amount / maxAmount) * 120,
                    backgroundColor: Colors.primary[500],
                  },
                ]}
              />
            </View>
            <Text style={styles.barLabel}>{item.month}</Text>
            <Text style={styles.barValue}>
              ₹{(item.amount / 1000).toFixed(1)}k
            </Text>
          </View>
        ))}
      </View>
    </View>
  );

  return (
    <>
      <Stack.Screen
        options={{
          headerShown: false,
        }}
      />

      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => router.back()}>
            <AntDesign name='arrowleft' size={24} color={Colors.neutral[800]} />
          </TouchableOpacity>
          <Text style={styles.title}>Purchase Analytics</Text>
          <TouchableOpacity style={styles.periodSelector}>
            <Text style={styles.periodText}>
              {periods.find((p) => p.id === selectedPeriod)?.label}
            </Text>
            <AntDesign name='down' size={16} color={Colors.neutral[600]} />
          </TouchableOpacity>
        </View>

        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.content}>
          <View style={styles.statsGrid}>
            {renderStatCard(
              'Total Spent',
              `₹${stats.totalSpent.toLocaleString()}`,
              <FontAwesome
                name='dollar'
                size={24}
                color={Colors.primary[700]}
              />,
              '+12%'
            )}
            {renderStatCard(
              'Total Orders',
              stats.totalOrders.toString(),
              <MaterialCommunityIcons
                name='package-variant'
                size={24}
                color={Colors.accent[500]}
              />,
              '+8%'
            )}
            {renderStatCard(
              'Average Order',
              `₹${stats.averageOrder.toLocaleString()}`,
              <MaterialCommunityIcons
                name='cart-outline'
                size={24}
                color={Colors.secondary[600]}
              />,
              '+5%'
            )}
            {renderStatCard(
              'Amount Saved',
              `₹${stats.savedAmount.toLocaleString()}`,
              <MaterialIcons
                name='trending-up'
                size={24}
                color={Colors.success[500]}
              />,
              '+15%'
            )}
          </View>

          <Card style={styles.chartCard}>{renderBarChart()}</Card>

          <Card style={styles.categoryCard}>
            <Text style={styles.sectionTitle}>Spending by Category</Text>
            <View style={styles.categoryList}>
              {categorySpending.map(renderCategoryItem)}
            </View>
          </Card>

          <Card style={styles.insightsCard}>
            <Text style={styles.sectionTitle}>Insights & Recommendations</Text>
            <View style={styles.insightsList}>
              <View style={styles.insightItem}>
                <View style={styles.insightIcon}>
                  <MaterialIcons
                    name='trending-up'
                    size={16}
                    color={Colors.success[500]}
                  />
                </View>
                <View style={styles.insightContent}>
                  <Text style={styles.insightTitle}>Spending Increase</Text>
                  <Text style={styles.insightText}>
                    Your spending increased by 12% this month, mainly due to
                    seasonal seed purchases.
                  </Text>
                </View>
              </View>

              <View style={styles.insightItem}>
                <View style={styles.insightIcon}>
                  <MaterialCommunityIcons
                    name='package-variant'
                    size={16}
                    color={Colors.primary[700]}
                  />
                </View>
                <View style={styles.insightContent}>
                  <Text style={styles.insightTitle}>Bulk Purchase Savings</Text>
                  <Text style={styles.insightText}>
                    You could save ₹2,400 annually by purchasing fertilizers in
                    bulk quantities.
                  </Text>
                </View>
              </View>

              <View style={styles.insightItem}>
                <View style={styles.insightIcon}>
                  <MaterialIcons
                    name='calendar-today'
                    size={16}
                    color={Colors.accent[500]}
                  />
                </View>
                <View style={styles.insightContent}>
                  <Text style={styles.insightTitle}>Seasonal Planning</Text>
                  <Text style={styles.insightText}>
                    Consider pre-ordering seeds for next season to take
                    advantage of early bird discounts.
                  </Text>
                </View>
              </View>
            </View>
          </Card>
        </ScrollView>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.neutral[50],
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: 60,
    paddingBottom: 16,
    backgroundColor: Colors.white,
    borderBottomWidth: 1,
    borderBottomColor: Colors.neutral[200],
  },
  backButton: {
    padding: 4,
  },
  title: {
    ...Typography.h4,
    flex: 1,
    textAlign: 'center',
  },
  periodSelector: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 4,
    paddingHorizontal: 8,
  },
  periodText: {
    ...Typography.bodySmall,
    color: Colors.neutral[600],
    marginRight: 4,
  },
  content: {
    padding: 16,
    paddingBottom: 40,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  statCard: {
    width: (width - 48) / 2,
    marginBottom: 16,
    padding: 16,
  },
  statHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  statIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.neutral[100],
    justifyContent: 'center',
    alignItems: 'center',
  },
  trendContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.success[50],
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  trendText: {
    ...Typography.caption,
    color: Colors.success[700],
    marginLeft: 2,
    fontFamily: 'Inter-Medium',
  },
  statValue: {
    ...Typography.h4,
    marginBottom: 4,
  },
  statTitle: {
    ...Typography.caption,
    color: Colors.neutral[600],
  },
  chartCard: {
    marginBottom: 24,
  },
  chartContainer: {
    padding: 4,
  },
  chartTitle: {
    ...Typography.h5,
    marginBottom: 20,
    textAlign: 'center',
  },
  chart: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'flex-end',
    height: 160,
    paddingHorizontal: 8,
  },
  barContainer: {
    alignItems: 'center',
    flex: 1,
  },
  barWrapper: {
    height: 120,
    justifyContent: 'flex-end',
    marginBottom: 8,
  },
  bar: {
    width: 24,
    borderRadius: 4,
    minHeight: 8,
  },
  barLabel: {
    ...Typography.caption,
    color: Colors.neutral[600],
    marginBottom: 2,
  },
  barValue: {
    ...Typography.caption,
    color: Colors.neutral[800],
    fontFamily: 'Inter-Medium',
  },
  categoryCard: {
    marginBottom: 24,
  },
  sectionTitle: {
    ...Typography.h5,
    marginBottom: 16,
  },
  categoryList: {
    gap: 12,
  },
  categoryItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
  },
  categoryInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  categoryColor: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 12,
  },
  categoryName: {
    ...Typography.body,
    flex: 1,
  },
  categoryStats: {
    alignItems: 'flex-end',
  },
  categoryAmount: {
    ...Typography.body,
    fontFamily: 'Inter-SemiBold',
  },
  categoryPercentage: {
    ...Typography.caption,
    color: Colors.neutral[600],
  },
  insightsCard: {
    marginBottom: 24,
  },
  insightsList: {
    gap: 16,
  },
  insightItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  insightIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: Colors.neutral[100],
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  insightContent: {
    flex: 1,
  },
  insightTitle: {
    ...Typography.body,
    fontFamily: 'Inter-SemiBold',
    marginBottom: 4,
  },
  insightText: {
    ...Typography.bodySmall,
    color: Colors.neutral[600],
    lineHeight: 18,
  },
});
